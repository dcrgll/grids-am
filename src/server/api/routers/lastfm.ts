import { z } from "zod";

import { getTopAlbums } from "@/lib/lastfm";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { LastFMGridSize, LastFMPeriod } from "@/types/lastfm";

export const lastFMRouter = createTRPCRouter({
  getTopAlbums: publicProcedure
    .input(
      z.object({
        gridSize: z.string(),
        period: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await getTopAlbums({
        gridSize: input.gridSize as LastFMGridSize,
        period: input.period as LastFMPeriod,
        user: input.username,
      });

      return {
        response,
      };
    }),
});
