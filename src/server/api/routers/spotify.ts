import { z } from "zod";

import { getAlbumData, getUserData } from "@/lib/spotify";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { SpotifyPeriod } from "@/types/spotify";

export const spotifyRouter = createTRPCRouter({
  getTopAlbums: publicProcedure
    .input(
      z.object({
        authToken: z.string(),
        period: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await getAlbumData({
        authToken: input.authToken,
        period: input.period as SpotifyPeriod,
      });

      return {
        response,
      };
    }),
  getUserData: publicProcedure
    .input(z.object({ authToken: z.string() }))
    .query(async ({ input }) => {
      const response = await getUserData(input.authToken);

      return {
        response,
      } as {
        error?: {
          message: string;
        };
        response?: {
          display_name?: string;
          error?: {
            message: string;
          };
        };
      };
    }),
});
