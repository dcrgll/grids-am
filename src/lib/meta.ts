import { type Metadata } from 'next'

const site = {
  url: 'https://lastfm.cargill.dev',
  title: 'Last.fm Album Cover Generator',
  description: 'Generate album covers from your Last.fm library'
}

export const meta = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    url: site.url,
    title: site.title,
    description: site.description
  }
} as Metadata
