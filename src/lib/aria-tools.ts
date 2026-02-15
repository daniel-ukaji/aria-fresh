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
  customAmounts?: { address: string; email?: string; amount: string }[]
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
  const group = {
    id,
    name,
    members: [{ address: creatorAddress }],
    createdBy: creatorAddress,
  }
  groups.set(id, group)
  
  return {
    success: true,
    group,
    message: `Created group "${name}"`,
  }
}

// Tool: Add member to group by wallet
export async function addMember({ 
  groupId, 
  memberAddress,
  email,
}: { 
  groupId: string
  memberAddress: string
  email?: string
}) {
  const group = groups.get(groupId)
  if (!group) {
    return { success: false, error: 'Group not found' }
  }
  
  group.members.push({ address: memberAddress, email })
  if (email) emailToWallet.set(email.toLowerCase(), memberAddress)
  
  return {
    success: true,
    group,
    message: `Added member to ${group.name}`,
  }
}

// Tool: Add member by email (stores mapping for later use)
export async function addMemberByEmail({ 
  groupId, 
  email,
}: { 
  groupId: string
  email: string
}) {
  const group = groups.get(groupId)
  if (!group) {
    return { success: false, error: 'Group not found' }
  }
  
  // Generate a deterministic wallet address from email for demo purposes
  // In production, this would call Privy API
  const hash = email.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  const walletAddress = `0x${Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)}`
  
  group.members.push({ address: walletAddress, email })
  emailToWallet.set(email.toLowerCase(), walletAddress)
  
  return {
    success: true,
    group,
    email,
    walletAddress,
    message: `Added ${email} to ${group.name}`,
  }
}

// Tool: Send equal amounts to group
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
    return { success: false, error: 'Group not found' }
  }
  
  const otherMembers = group.members.slice(1)
  if (otherMembers.length === 0) {
    return { success: false, error: 'Add members first' }
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
    success: true,
    split: {
      id: splitId,
      groupName: group.name,
      amount,
      description,
      perPerson,
      memberCount: otherMembers.length,
      status: 'pending',
    },
    message: `Sending $${perPerson} to each of ${otherMembers.length} members`,
  }
}

// Tool: Prepare custom payment (returns data for PaymentCard)
export async function prepareCustomPayment({
  payments,
  memo,
  payerAddress,
}: {
  payments: { email: string; amount: string }[]
  memo: string
  payerAddress: string
}) {
  const resolvedPayments = []
  
  for (const payment of payments) {
    // Look up wallet from our local cache, or generate one
    let walletAddress = emailToWallet.get(payment.email.toLowerCase())
    
    if (!walletAddress) {
      // Generate deterministic address for demo
      const hash = payment.email.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      walletAddress = `0x${Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)}`
      emailToWallet.set(payment.email.toLowerCase(), walletAddress)
    }
    
    resolvedPayments.push({
      address: walletAddress,
      email: payment.email,
      amount: payment.amount,
    })
  }
  
  const totalAmount = resolvedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)
  const memoHex = toHex(memo.slice(0, 32).padEnd(32, '\0'), { size: 32 })
  
  // Build transaction calls
  const calls = resolvedPayments.map(payment => {
    const amountInUnits = parseUnits(payment.amount, 6)
    return {
      to: TOKENS.ALPHA_USD,
      data: encodeFunctionData({
        abi: TIP20_ABI,
        functionName: 'transferWithMemo',
        args: [payment.address as `0x${string}`, amountInUnits, memoHex],
      }),
      value: '0',
      recipient: payment.address,
      amount: amountInUnits.toString(),
      memoHex,
    }
  })
  
  // Store for reference
  const splitId = `custom_${Date.now()}`
  splits.set(splitId, {
    id: splitId,
    groupId: 'custom',
    amount: totalAmount,
    description: memo,
    perPerson: 'custom',
    members: resolvedPayments.map(p => p.address),
    customAmounts: resolvedPayments,
    status: 'pending',
  })
  
  return {
    success: true,
    splitId,
    totalAmount,
    recipientCount: resolvedPayments.length,
    memo,
    calls,
    payments: resolvedPayments,
    summary: `$${resolvedPayments.map(p => `${p.amount} to ${p.email}`).join(', $')}`,
  }
}

// Tool: Build batch payment for a split
export async function buildBatchPayment({
  splitId,
  payerAddress,
}: {
  splitId: string
  payerAddress: string
}) {
  const split = splits.get(splitId)
  if (!split) {
    return { success: false, error: 'Split not found' }
  }
  
  const memoHex = toHex(split.description.slice(0, 32).padEnd(32, '\0'), { size: 32 })
  
  let calls
  let totalAmount: string
  
  if (split.customAmounts && split.customAmounts.length > 0) {
    calls = split.customAmounts.map(payment => {
      const amountInUnits = parseUnits(payment.amount, 6)
      return {
        to: TOKENS.ALPHA_USD,
        data: encodeFunctionData({
          abi: TIP20_ABI,
          functionName: 'transferWithMemo',
          args: [payment.address as `0x${string}`, amountInUnits, memoHex],
        }),
        value: '0',
        recipient: payment.address,
        amount: amountInUnits.toString(),
        memoHex,
      }
    })
    totalAmount = split.amount
  } else {
    const amountPerPerson = parseUnits(split.perPerson, 6)
    calls = split.members.map(recipient => ({
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
    totalAmount = (parseFloat(split.perPerson) * split.members.length).toFixed(2)
  }
  
  return {
    success: true,
    splitId,
    calls,
    summary: {
      totalRecipients: calls.length,
      amountPerPerson: split.perPerson,
      totalAmount,
      memo: split.description,
    },
  }
}

// Tool: List groups
export async function listGroups({ userAddress }: { userAddress: string }) {
  const userGroups = Array.from(groups.values()).filter(g =>
    g.members.some(m => m.address.toLowerCase() === userAddress.toLowerCase())
  )
  return { groups: userGroups, count: userGroups.length }
}