import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { type SpotifyPeriod } from '@/types/spotify'
import { getAlbumData, getUserData } from '@/lib/spotify'

export const spotifyRouter = createTRPCRouter({
  getTopAlbums: publicProcedure
    .input(
      z.object({
        period: z.string(),
        authToken: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const response = await getAlbumData({
        period: input.period as SpotifyPeriod,
        authToken: input.authToken
      })

      return {
        response
      }
    }),
  getUserData: publicProcedure
    .input(z.object({ authToken: z.string() }))
    .query(async ({ input }) => {
      const response = await getUserData(input.authToken)

      return {
        response
      } as {
        error?: {
          message: string
        }
        response?: {
          display_name?: string
          error?: {
            message: string
          }
        }
      }
    })
})
