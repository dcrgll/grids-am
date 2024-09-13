import { type Metadata } from 'next'

const site = {
  url: 'https://grids.am',
  title: 'Grids',
  description: 'Generate album covers from your music library'
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
    description: site.description,
    siteName: site.title,
    images: [
      {
        url: '/og-image.png'
      }
    ]
  }
} as Metadata
