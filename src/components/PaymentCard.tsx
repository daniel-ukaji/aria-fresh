'use client'

import { useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { z } from 'zod'

export const paymentCardSchema = z.object({
  splitId: z.string().describe("The split ID"),
  totalAmount: z.string().describe("Total amount to pay"),
  recipientCount: z.number().describe("Number of recipients"),
  memo: z.string().describe("Payment memo/description"),
  calls: z.array(z.object({
    to: z.string(),
    data: z.string(),
    value: z.string(),
    recipient: z.string(),
    amount: z.string(),
  })).describe("Transaction calls to execute"),
})

export type PaymentCardProps = z.infer<typeof paymentCardSchema>

export function PaymentCard({ splitId, totalAmount, recipientCount, memo, calls }: PaymentCardProps) {
  const { wallets } = useWallets()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')

  const handlePayment = async () => {
    if (!embeddedWallet) {
      setError('No wallet connected')
      return
    }

    setStatus('pending')
    setError(null)

    try {
      const provider = await embeddedWallet.getEthereumProvider()
      
      for (const call of calls) {
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: embeddedWallet.address,
            to: call.to,
            data: call.data,
            value: '0x0',
          }],
        })
        setTxHash(txHash as string)
      }
      
      setStatus('success')
    } catch (err) {
      console.error('Payment failed:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
      setStatus('error')
    }
  }

  if (!splitId || !calls) return null

  return (
    <div className="card p-6 max-w-xs animate-in">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        {status === 'success' && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Sent
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-neutral-900 mb-1">Confirm Payment</h3>
      <p className="text-sm text-neutral-500 mb-6">{memo}</p>

      <div className="bg-neutral-50 rounded-2xl p-4 space-y-3 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">Amount</span>
          <span className="text-2xl font-semibold text-neutral-900">${totalAmount}</span>
        </div>
        <div className="h-px bg-neutral-200" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Recipients</span>
          <span className="text-sm font-medium text-neutral-900">{recipientCount}</span>
        </div>
      </div>

      {status === 'idle' && (
        <button
          onClick={handlePayment}
          className="btn-primary w-full justify-center"
        >
          Pay ${totalAmount} αUSD
        </button>
      )}

      {status === 'pending' && (
        <div className="flex items-center justify-center gap-2 py-3 text-neutral-500">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">Processing...</span>
        </div>
      )}

      {status === 'success' && txHash && (
        <a
          href={`https://explore.tempo.xyz/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-violet-600 hover:text-violet-700 transition-colors"
        >
          <span className="text-sm font-medium">View transaction</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}

      {status === 'error' && (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button
            onClick={handlePayment}
            className="btn-secondary"
          >
            Try again
          </button>
        </div>
      )}

      <div className="pt-4 mt-4 border-t border-neutral-100">
        <code className="text-xs text-neutral-400">{splitId}</code>
      </div>
    </div>
  )
}