import type { Metadata } from 'next'
import { Bebas_Neue, Orbitron, Montserrat } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Super Bowl LX 2026 - Patriots vs Seahawks',
  description: 'Vote for who will win Super Bowl LX (2026)! New England Patriots vs. Seattle Seahawks - February 8, 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${orbitron.variable} ${montserrat.variable}`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#69be28',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
