'use client'

import dynamic from 'next/dynamic'

const ChatWrapper = dynamic(
  () => import('@/components/ChatWrapper').then(mod => ({ default: mod.ChatWrapper })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex flex-col bg-white">
        <header className="border-b border-neutral-100">
          <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-base font-semibold text-neutral-900">Aria</span>
            </div>
            <div className="h-9 w-24 bg-neutral-100 rounded-full animate-pulse" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
)

export default function ChatPage() {
  return <ChatWrapper />
}