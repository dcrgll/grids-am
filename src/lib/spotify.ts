import { env } from '@/env'
import {
  type SpotifyAlbum,
  type SpotifyPeriod,
  type SpotifyTrack
} from '@/types/spotify'

async function getTopTracks(authToken: string, period: SpotifyPeriod) {
  const limit = 50

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${period}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    )

    const data = (await response.json()) as {
      items: SpotifyTrack[]
    }

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export async function getAlbumData({
  authToken,
  period
}: {
  authToken: string
  period: SpotifyPeriod
}) {
  const topTracks = await getTopTracks(authToken, period)

  if (!topTracks?.items) {
    return []
  }

  const albumData = topTracks.items.map(
    (track: {
      album: {
        name: string
        images: { url: string }[]
      }
      artists: { name: string }[]
    }) => ({
      name: track.album.name,
      artist: track.artists[0]?.name,
      src: track.album.images[0]?.url
    })
  ) as SpotifyAlbum[]

  return removeDuplicateAlbums(albumData)
}

export async function removeDuplicateAlbums(albumData: SpotifyAlbum[]) {
  const uniqueAlbums = albumData.filter(
    (album, index, self) =>
      index === self.findIndex((t) => t.name === album.name)
  )
  return uniqueAlbums
}

export async function getUserData(authToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })

    if (response.status === 200) {
      const data = (await response.json()) as {
        display_name: string
      }

      return data
    }

    return {
      error: {
        message: 'Failed to fetch user data'
      }
    }
  } catch (error) {
    console.log(error, 'error')
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export function getAuthTokenFromHash() {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(
      function (initial, item) {
        if (item) {
          const parts = item.split('=')
          if (parts[0] && parts[1]) {
            initial[parts[0]] = decodeURIComponent(parts[1])
          }
        }
        return initial
      },
      {} as Record<string, string>
    )

  return hash.access_token
}

export function spotifyAuthUrl() {
  const client_id = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirect_uri = env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

  const scope = 'user-top-read user-read-private user-read-email'

  let url = 'https://accounts.spotify.com/authorize'
  url += '?response_type=token'
  url += '&client_id=' + encodeURIComponent(client_id)
  url += '&scope=' + encodeURIComponent(scope)
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

  return url
}

const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

export const codeVerifier = generateRandomString(64)

export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

export const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export const getTokenFromCode = async (code: string) => {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      code_verifier: window.localStorage.getItem('code_verifier') ?? ''
    })
  }

  const body = await fetch('https://accounts.spotify.com/api/token', payload)

  const response = (await body.json()) as {
    access_token: string
  }

  localStorage.setItem('access_token', response.access_token)

  return response.access_token
}
