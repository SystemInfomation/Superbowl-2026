import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Super Bowl LX 2026 - Patriots vs Seahawks | Vote Now!',
  description: 'Vote for who will win Super Bowl LX (2026)! New England Patriots vs. Seattle Seahawks - February 8, 2026. Cast your vote and see live results!',
  keywords: ['Super Bowl LX', 'Super Bowl 2026', 'Patriots vs Seahawks', 'NFL voting', 'New England Patriots', 'Seattle Seahawks', 'Super Bowl prediction'],
  authors: [{ name: 'Super Bowl LX Voting App' }],
  creator: 'Super Bowl LX Voting App',
  publisher: 'Super Bowl LX Voting App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://superbowl-2026.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Super Bowl LX 2026 - Patriots vs Seahawks | Vote Now!',
    description: 'Vote for who will win Super Bowl LX (2026)! New England Patriots vs. Seattle Seahawks - February 8, 2026. Cast your vote and see live results!',
    url: 'https://superbowl-2026.vercel.app',
    siteName: 'Super Bowl LX 2026 Voting',
    images: [
      {
        url: 'https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2026/02/super-bowl-lx-logo-.jpg',
        width: 862,
        height: 485,
        alt: 'Super Bowl LX 2026 Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Bowl LX 2026 - Patriots vs Seahawks | Vote Now!',
    description: 'Vote for who will win Super Bowl LX (2026)! New England Patriots vs. Seattle Seahawks - February 8, 2026.',
    images: ['https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2026/02/super-bowl-lx-logo-.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: 'https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2026/02/super-bowl-lx-logo-.jpg',
    shortcut: 'https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2026/02/super-bowl-lx-logo-.jpg',
    apple: 'https://www.nbc.com/sites/nbcblog/files/styles/scale_862/public/2026/02/super-bowl-lx-logo-.jpg',
  },
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
