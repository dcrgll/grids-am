import { cookies } from 'next/headers'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { type SpotifyPeriod } from '@/types/spotify'
import { getAlbumData, getUserData } from '@/lib/spotify'

export const spotifyRouter = createTRPCRouter({
  getTopAlbums: publicProcedure
    .input(
      z.object({
        period: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const c = cookies()

      const accessToken = c.get('spotify_access_token')

      const response = await getAlbumData({
        period: input.period as SpotifyPeriod,
        accessToken: accessToken?.value ?? ''
      })

      return {
        response
      }
    }),
  getUserData: publicProcedure.query(async ({}) => {
    const c = cookies()

    const accessToken = c.get('spotify_access_token')

    const response = await getUserData(accessToken?.value ?? '')

    return {
      response
    }
  })
})
