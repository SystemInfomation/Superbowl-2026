import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400..900&family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
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
