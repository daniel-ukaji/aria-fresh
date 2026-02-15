'use client'

import { z } from 'zod'

export const splitCardSchema = z.object({
  id: z.string().describe("The split ID"),
  groupName: z.string().describe("The group name"),
  amount: z.string().describe("Total amount"),
  description: z.string().describe("What the expense is for"),
  perPerson: z.string().describe("Amount per person"),
  memberCount: z.number().describe("Number of recipients"),
  status: z.string().describe("Split status: pending or executed"),
})

export type SplitCardProps = z.infer<typeof splitCardSchema>

export function SplitCard({ id, groupName, amount, description, perPerson, memberCount, status }: SplitCardProps) {
  if (!id) return null

  return (
    <div className="card p-6 max-w-xs animate-in">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M12 4v16M2 12h20" />
          </svg>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          status === 'executed' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {status === 'executed' ? 'Paid' : 'Pending'}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-1">{description || 'Payment'}</h3>
      <p className="text-sm text-neutral-500 mb-6">{groupName || 'Group'}</p>
      
      <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">Total</span>
          <span className="text-2xl font-semibold text-neutral-900">${amount}</span>
        </div>
        <div className="h-px bg-neutral-200" />
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-500">{memberCount} {memberCount === 1 ? 'person' : 'people'}</span>
          <span className="text-lg font-semibold text-violet-600">${perPerson} each</span>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t border-neutral-100">
        <code className="text-xs text-neutral-400">{id}</code>
      </div>
    </div>
  )
}