import {
  type SpotifyAlbum,
  type SpotifyPeriod,
  type SpotifyTrack
} from '@/types/spotify'

async function getTopTracks(accessToken: string, period: SpotifyPeriod) {
  const limit = 50

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${period}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    console.log(response, 'response')

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
  accessToken,
  period
}: {
  accessToken: string
  period: SpotifyPeriod
}) {
  const topTracks = await getTopTracks(accessToken, period)

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

export async function getUserData(accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log(response, 'response')

    const data = (await response.json()) as {
      display_name: string
    }

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
