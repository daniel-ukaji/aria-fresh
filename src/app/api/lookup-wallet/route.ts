import { PrivyClient } from '@privy-io/server-auth'
import { NextRequest, NextResponse } from 'next/server'

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Try to find existing user
    let user = await privy.getUserByEmail(email).catch(() => null)
    
    // If not found, create a new user with embedded wallet
    if (!user) {
      user = await privy.importUser({
        linkedAccounts: [
          {
            type: 'email',
            address: email,
          },
        ],
        createEmbeddedWallet: true,
      })
    }

    // Find their wallet
    const wallet = user.linkedAccounts.find(
      (account) => account.type === 'wallet'
    )

    if (!wallet || !('address' in wallet)) {
      return NextResponse.json({ error: 'No wallet found' }, { status: 404 })
    }

    return NextResponse.json({ 
      address: (wallet as { address: string }).address,
      email,
      isNew: !user.createdAt || Date.now() - new Date(user.createdAt).getTime() < 5000,
    })
  } catch (error) {
    console.error('Wallet lookup error:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}