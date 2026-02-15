'use client'

import { z } from 'zod'

export const balanceCardSchema = z.object({
  address: z.string().describe("The wallet address"),
  balance: z.string().describe("The balance amount"),
  token: z.string().describe("The token symbol"),
})

export type BalanceCardProps = z.infer<typeof balanceCardSchema>

export function BalanceCard({ address, balance, token }: BalanceCardProps) {
  if (!address || !balance || !token) {
    return null
  }

  const formattedBalance = parseFloat(balance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="card p-6 max-w-xs animate-in">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12M6 12h12" />
          </svg>
        </div>
        <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
          Tempo
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-neutral-500 mb-1">Balance</p>
        <p className="text-4xl font-semibold tracking-tight text-neutral-900">
          {formattedBalance}
        </p>
        <p className="text-lg text-neutral-400 font-medium">{token}</p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <code className="text-xs text-neutral-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </code>
        <button
          onClick={() => navigator.clipboard.writeText(address)}
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  )
}