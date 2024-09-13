export const metadata = {
  title: 'Grids // Spotify',
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
