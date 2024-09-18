'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'

export default function SpotifyCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const hashParams = getHashParams()
    if (hashParams?.accessToken) {
      cookies.set('spotify_access_token', hashParams.accessToken)
    }

    void router.push('/spotify')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </main>
  )
}

function getHashParams() {
  // Get the hash part of the URL
  const hash = window?.location.hash

  // Check if the hash contains the access_token
  if (hash.includes('access_token')) {
    // Extract the access_token using URLSearchParams
    const params = new URLSearchParams(hash.substring(1)) // Remove the leading '#'
    const token = params.get('access_token')

    return { accessToken: token }
  }
}
