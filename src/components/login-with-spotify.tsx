import Link from 'next/link'

import { spotifyAuthUrl } from '@/lib/spotify'
import { Button } from '@/components/ui/button'

export default function LoginWithSpotifyButton() {
  return (
    <Button asChild className="mt-4 w-full bg-green-500 hover:bg-green-700">
      <Link href={spotifyAuthUrl()}>Login with Spotify</Link>
    </Button>
  )
}
