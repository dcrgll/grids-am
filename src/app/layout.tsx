import '@/styles/globals.css'

import { env } from 'process'
import { TRPCReactProvider } from '@/trpc/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'

import { meta } from '@/lib/meta'

export const metadata = {
  ...meta
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
    </html>
  )
}
