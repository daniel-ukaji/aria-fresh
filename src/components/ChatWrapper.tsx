'use client'

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { ARIA_SYSTEM_PROMPT } from "@/lib/aria-prompt";
import { TamboProvider } from "@tambo-ai/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { WalletButton } from "@/components/WalletButton";

export function ChatWrapper() {
  const mcpServers = useMcpServers();
  const { user, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const walletAddress = embeddedWallet?.address;
  
  const userKey = user?.id ?? "anonymous";

  // Pass system prompt and wallet context together
  const contextHelpers = {
    walletContext: () => ({
      userWalletAddress: walletAddress ?? null,
      isConnected: authenticated && !!walletAddress,
    }),
    systemInstructions: () => ARIA_SYSTEM_PROMPT,
  };

  if (!ready) {
    return (
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
    )
  }

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      userKey={userKey}
      contextHelpers={contextHelpers}
    >
      <div className="h-screen flex flex-col bg-white">
        <header className="border-b border-neutral-100">
          <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-base font-semibold text-neutral-900">Aria</span>
            </div>
            <WalletButton />
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <MessageThreadFull className="max-w-3xl mx-auto h-full px-6" />
        </div>
      </div>
    </TamboProvider>
  );
}