export const metadata = {
  title: 'Spotify Collage Generator',
  description:
    'Generate a collage of your most listened to albums from Spotify.'
}

export default function SpotifyLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
