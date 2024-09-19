'use client'

import { useEffect } from 'react'

import { env } from '@/env'
import { base64encode, codeVerifier, sha256 } from '@/lib/spotify'
import { Button } from '@/components/ui/button'

export default function LoginWithSpotifyButton() {
  useEffect(() => {
    const storedCodeVerifier = window.localStorage.getItem('code_verifier')

    if (!storedCodeVerifier) {
      const newCodeVerifier = codeVerifier
      window.localStorage.setItem('code_verifier', newCodeVerifier)
    }
  }, [])

  const onClick = async () => {
    const hashed = await sha256(
      window.localStorage.getItem('code_verifier') ?? ''
    )
    const codeChallenge = base64encode(hashed)

    const params = {
      response_type: 'code',
      client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      scope: 'user-top-read',
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
    }

    const authUrl = new URL('https://accounts.spotify.com/authorize')

    authUrl.search = new URLSearchParams(params).toString()
    window.location.href = authUrl.toString()
  }

  return (
    <Button
      className="mt-4 w-full bg-green-500 hover:bg-green-700"
      onClick={onClick}
    >
      Login with Spotify
    </Button>
  )
}
