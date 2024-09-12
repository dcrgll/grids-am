import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

import { type LastFMGridSize, type LastFMPeriod } from '@/types/lastfm'
import { getTopAlbums } from '@/lib/lastfm'

export const lastFMRouter = createTRPCRouter({
  getTopAlbums: publicProcedure
    .input(
      z.object({
        username: z.string(),
        period: z.string(),
        gridSize: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const response = await getTopAlbums({
        user: input.username,
        gridSize: input.gridSize as LastFMGridSize,
        period: input.period as LastFMPeriod
      })

      return {
        response
      }
    })
})
