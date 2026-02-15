'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useReadContract } from 'wagmi'
import { TOKENS, TIP20_ABI, tempoTestnet } from '@/lib/tempo'
import { formatUnits } from 'viem'

export function WalletButton() {
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets } = useWallets()
  
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')
  const address = embeddedWallet?.address as `0x${string}` | undefined

  const { data: rawBalance, refetch } = useReadContract({
    address: TOKENS.ALPHA_USD,
    abi: TIP20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: tempoTestnet.id,
  })

  const balance = rawBalance 
    ? parseFloat(formatUnits(rawBalance as bigint, 6)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  if (!ready) {
    return (
      <div className="h-10 w-32 bg-neutral-100 rounded-full animate-pulse" />
    )
  }

  if (!authenticated) {
    return (
      <button 
        onClick={login}
        className="btn-primary"
      >
        Connect
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => refetch()}
        className="flex items-center gap-3 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-colors"
      >
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-neutral-900">{balance}</span>
          <span className="text-xs text-neutral-500">αUSD</span>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {address?.slice(2, 4).toUpperCase()}
        </div>
      </button>
      <button 
        onClick={logout}
        className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
        title="Logout"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  )
}