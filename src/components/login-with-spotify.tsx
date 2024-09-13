import Link from 'next/link'

import { env } from '@/env'
import { Button } from '@/components/ui/button'

export default function LoginWithSpotifyButton() {
  const client_id = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirect_uri = env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

  const scope = 'user-top-read'

  let url = 'https://accounts.spotify.com/authorize'
  url += '?response_type=token'
  url += '&client_id=' + encodeURIComponent(client_id)
  url += '&scope=' + encodeURIComponent(scope)
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

  return (
    <Button asChild className="mt-4 w-full bg-green-500 hover:bg-green-700">
      <Link href={url}>Login with Spotify</Link>
    </Button>
  )
}
