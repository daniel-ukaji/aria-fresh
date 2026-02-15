import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-base font-semibold text-neutral-900">Aria</span>
          </div>
          <Link 
            href="/chat"
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            Try Aria
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6">
        <section className="py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Prototype • Built on Tempo
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-6">
              Payments as natural
              <br />
              as conversation
            </h1>
            
            <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
              Send money to friends just by chatting. No wallets, no addresses, no apps. Just say who and how much.
            </p>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/chat"
                className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Try the Prototype
              </Link>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-neutral-600 text-sm font-medium hover:text-neutral-900 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* Demo Preview */}
        <section className="pb-24">
          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
            </div>
            <div className="p-6 md:p-8 bg-white">
              <div className="space-y-4 max-w-lg">
                <div className="flex justify-end">
                  <div className="bg-neutral-900 text-white px-4 py-2 rounded-2xl rounded-br-md text-sm">
                    Send $50 to jane@example.com for coffee
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-neutral-100 px-4 py-2 rounded-2xl rounded-bl-md text-sm text-neutral-700">
                    Ready to send $50 to Jane. Hit Pay!
                  </div>
                </div>

                {/* Payment Card */}
                <div className="border border-neutral-200 rounded-xl p-4 max-w-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-900">Coffee</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Ready</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-neutral-500">Amount</span>
                    <span className="text-xl font-semibold">$50.00</span>
                  </div>
                  <div className="bg-neutral-900 text-white text-center py-2 rounded-lg text-sm font-medium">
                    Pay $50 αUSD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 border-t border-neutral-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">Just Chat</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                "Send $100 to john@example.com for dinner." That's it. No forms, no wallet addresses.
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">Email = Wallet</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Add friends by email. We create wallets for them instantly. No crypto knowledge needed.
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">On-Chain Receipts</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Every payment has a memo stored on-chain. "Rent", "Dinner", "Trip"—permanent records.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-t border-neutral-100">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-12">How it works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xs font-medium text-neutral-400 mb-3">01</div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Sign In</h3>
              <p className="text-sm text-neutral-500">Enter your email. We create a wallet for you instantly.</p>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-400 mb-3">02</div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Chat</h3>
              <p className="text-sm text-neutral-500">"Send $50 to friend@email.com" or "Split $200 with my group."</p>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-400 mb-3">03</div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Confirm</h3>
              <p className="text-sm text-neutral-500">Review the payment card. One tap to send.</p>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-400 mb-3">04</div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Done</h3>
              <p className="text-sm text-neutral-500">Money sent on-chain with a memo. They get an email to claim it.</p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-24 border-t border-neutral-100">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">The Vision</h2>
            <p className="text-neutral-500 leading-relaxed mb-8">
              This is a prototype. Our goal is to bring conversational payments to where people already chat.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="border border-neutral-200 rounded-xl p-4">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">iMessage</h3>
                <p className="text-xs text-neutral-500">Text your friends. Split the bill. Done.</p>
              </div>
              <div className="border border-neutral-200 rounded-xl p-4">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">WhatsApp</h3>
                <p className="text-xs text-neutral-500">Family group chat becomes a shared wallet.</p>
              </div>
              <div className="border border-neutral-200 rounded-xl p-4">
                <div className="text-2xl mb-2">✈️</div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Telegram</h3>
                <p className="text-xs text-neutral-500">Pay your crypto friends without leaving the chat.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-24 border-t border-neutral-100">
          <h2 className="text-sm font-medium text-neutral-400 mb-8">Built with</h2>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-sm font-medium">Tempo</span>
              <span className="text-xs text-neutral-400">— Instant payments with memos</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-sm font-medium">Privy</span>
              <span className="text-xs text-neutral-400">— Email to wallet</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-sm font-medium">Tambo</span>
              <span className="text-xs text-neutral-400">— AI chat interface</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm text-neutral-500">Aria</span>
          </div>
          <p className="text-sm text-neutral-400">
            Tempo × Privy Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  )
}