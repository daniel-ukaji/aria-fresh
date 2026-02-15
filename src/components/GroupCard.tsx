'use client'

import { z } from 'zod'

export const groupCardSchema = z.object({
  id: z.string().describe("The group ID"),
  name: z.string().describe("The group name"),
  members: z.array(z.object({
    address: z.string(),
    email: z.string().optional(),
  })).describe("List of group members"),
  createdBy: z.string().describe("Address of the group creator"),
})

export type GroupCardProps = z.infer<typeof groupCardSchema>

function MemberAvatar({ address, isCreator }: { address: string; isCreator: boolean }) {
  if (!address) return null
  
  const hue = parseInt(address.slice(2, 8), 16) % 360
  
  return (
    <div className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-neutral-50 transition-colors">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
        style={{ background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${hue + 30}, 70%, 45%))` }}
      >
        {address.slice(2, 4).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        {isCreator && (
          <p className="text-xs text-violet-600 font-medium">Admin</p>
        )}
      </div>
    </div>
  )
}

export function GroupCard({ id, name, members, createdBy }: GroupCardProps) {
  if (!id || !name || !members || !Array.isArray(members)) {
    return null
  }

  const validMembers = members.filter(m => m && m.address)

  return (
    <div className="card p-6 max-w-xs animate-in">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
          {validMembers.length} member{validMembers.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{name}</h3>
      
      <div className="space-y-1 mb-4">
        {validMembers.map((member) => (
          <MemberAvatar 
            key={member.address} 
            address={member.address} 
            isCreator={createdBy ? member.address.toLowerCase() === createdBy.toLowerCase() : false}
          />
        ))}
      </div>
      
      <div className="pt-4 border-t border-neutral-100">
        <code className="text-xs text-neutral-400">{id}</code>
      </div>
    </div>
  )
}