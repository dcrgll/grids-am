import '@/styles/globals.css'

import { type Metadata } from 'next'
import { TRPCReactProvider } from '@/trpc/react'
import { GeistSans } from 'geist/font/sans'

import { meta } from '@/lib/meta'

export const metadata = {
  ...meta
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  )
}
