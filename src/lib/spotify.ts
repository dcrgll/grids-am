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

    console.log(response, 'response getUserData')

    const data = (await response.json()) as {
      display_name: string
    }

    return data
  } catch (error) {
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

  const scope = 'user-top-read'

  let url = 'https://accounts.spotify.com/authorize'
  url += '?response_type=token'
  url += '&client_id=' + encodeURIComponent(client_id)
  url += '&scope=' + encodeURIComponent(scope)
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

  return url
}
