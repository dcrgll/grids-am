import { env } from '@/env'
import { type Album } from '@/types/album'
import {
  LastFMGridSize,
  LastFMLimit,
  type LastFMPeriod,
  type LastFMUser
} from '@/types/lastfm'

export const lastfm_config = {
  api_key: env.LASTFM_API_KEY,
  user: 'dancargill',
  period: {
    overall: 'overall',
    sevenDays: '7day',
    oneMonth: '1month',
    threeMonths: '3month',
    sixMonths: '6month',
    twelveMonths: '12month'
  },
  limit: 9
}

export async function getTopAlbums({
  user,
  gridSize,
  period
}: {
  user: LastFMUser
  gridSize: LastFMGridSize
  period: LastFMPeriod
}) {
  const limit = getLimit(gridSize)

  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&api_key=${env.LASTFM_API_KEY}&format=json`
  )

  const data = (await res.json()) as { topalbums: { album: Album[] } }

  return data.topalbums.album
}

export const getLimit = (gridsize: LastFMGridSize) => {
  switch (gridsize) {
    case LastFMGridSize.three:
      return LastFMLimit.nine
    case LastFMGridSize.four:
      return LastFMLimit.sixteen
    case LastFMGridSize.five:
      return LastFMLimit.twentyFive
    case LastFMGridSize.ten:
      return LastFMLimit.oneHundred
  }
}
