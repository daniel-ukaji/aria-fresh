import { createPublicClient, http, formatUnits, parseUnits, encodeFunctionData, toHex } from 'viem'
import { tempoTestnet, TOKENS, TIP20_ABI } from './tempo'

const publicClient = createPublicClient({
  chain: tempoTestnet,
  transport: http(),
})

// Types
type Group = {
  id: string
  name: string
  members: { address: string; email?: string }[]
  createdBy: string
}

type Split = {
  id: string
  groupId: string
  amount: string
  description: string
  perPerson: string
  members: string[]
  status: 'pending' | 'executed'
}

// Persist across hot reloads
const globalForAria = globalThis as unknown as {
  groups: Map<string, Group>
  splits: Map<string, Split>
  emailToWallet: Map<string, string>
}

if (!globalForAria.groups) globalForAria.groups = new Map()
if (!globalForAria.splits) globalForAria.splits = new Map()
if (!globalForAria.emailToWallet) globalForAria.emailToWallet = new Map()

const groups = globalForAria.groups
const splits = globalForAria.splits
const emailToWallet = globalForAria.emailToWallet

// Tool: Get wallet balance
export async function getBalance({ address }: { address: string }) {
  try {
    const balance = await publicClient.readContract({
      address: TOKENS.ALPHA_USD,
      abi: TIP20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
    
    return {
      address,
      balance: formatUnits(balance as bigint, 6),
      token: 'αUSD',
    }
  } catch (error) {
    return {
      address,
      balance: '0',
      token: 'αUSD',
    }
  }
}

// Tool: Create a new group
export async function createGroup({ 
  name, 
  creatorAddress 
}: { 
  name: string
  creatorAddress: string 
}) {
  const id = `group_${Date.now()}`
  const group: Group = {
    id,
    name,
    members: [{ address: creatorAddress }],
    createdBy: creatorAddress,
  }
  groups.set(id, group)
  
  return {
    id: group.id,
    name: group.name,
    members: group.members,
    createdBy: group.createdBy,
  }
}

// Tool: Add member by email
export async function addMemberByEmail({ 
  groupId, 
  email,
}: { 
  groupId: string
  email: string
}) {
  const group = groups.get(groupId)
  if (!group) {
    return { error: 'Group not found' }
  }
  
  // Check if already have wallet for this email
  let walletAddress = emailToWallet.get(email.toLowerCase())
  let isNewWallet = false
  
  if (!walletAddress) {
    // Generate deterministic address from email for demo
    const hash = email.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    walletAddress = `0x${Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)}`
    emailToWallet.set(email.toLowerCase(), walletAddress)
    isNewWallet = true
  }
  
  group.members.push({ address: walletAddress, email })
  
  return {
    id: group.id,
    name: group.name,
    members: group.members,
    createdBy: group.createdBy,
    addedEmail: email,
    addedWallet: walletAddress,
    walletCreated: isNewWallet,
  }
}

// Tool: Create equal split
export async function createSplit({
  groupId,
  amount,
  description,
}: {
  groupId: string
  amount: string
  description: string
}) {
  const group = groups.get(groupId)
  if (!group) {
    return { error: 'Group not found' }
  }
  
  const otherMembers = group.members.slice(1)
  if (otherMembers.length === 0) {
    return { error: 'Add members to the group first' }
  }
  
  const totalAmount = parseFloat(amount)
  const perPerson = (totalAmount / otherMembers.length).toFixed(2)
  
  const splitId = `split_${Date.now()}`
  const split: Split = {
    id: splitId,
    groupId,
    amount,
    description,
    perPerson,
    members: otherMembers.map(m => m.address),
    status: 'pending',
  }
  splits.set(splitId, split)
  
  return {
    id: splitId,
    groupName: group.name,
    amount: amount,
    description: description,
    perPerson: perPerson,
    memberCount: otherMembers.length,
    status: 'pending',
  }
}

// Tool: Build batch payment
export async function buildBatchPayment({
  splitId,
  payerAddress,
}: {
  splitId: string
  payerAddress: string
}) {
  const split = splits.get(splitId)
  if (!split) {
    return { error: 'Split not found' }
  }
  
  const memoHex = toHex(split.description.slice(0, 32).padEnd(32, '\0'), { size: 32 })
  const amountPerPerson = parseUnits(split.perPerson, 6)
  
  const calls = split.members.map(recipient => ({
    to: TOKENS.ALPHA_USD,
    data: encodeFunctionData({
      abi: TIP20_ABI,
      functionName: 'transferWithMemo',
      args: [recipient as `0x${string}`, amountPerPerson, memoHex],
    }),
    value: '0',
    recipient,
    amount: amountPerPerson.toString(),
    memoHex,
  }))
  
  const totalAmount = (parseFloat(split.perPerson) * split.members.length).toFixed(2)
  
  return {
    splitId,
    totalAmount,
    recipientCount: split.members.length,
    memo: split.description,
    calls,
  }
}

// Tool: List groups
export async function listGroups({ userAddress }: { userAddress: string }) {
  const userGroups = Array.from(groups.values()).filter(g =>
    g.members.some(m => m.address.toLowerCase() === userAddress.toLowerCase())
  )
  return { groups: userGroups, count: userGroups.length }
}