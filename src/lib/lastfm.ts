import { env } from "@/env";
import type { Album } from "@/types/album";
import { LastFMGridSize, LastFMLimit } from "@/types/lastfm";
import type { LastFMPeriod, LastFMUser } from "@/types/lastfm";

export const lastfm_config = {
  api_key: env.LASTFM_API_KEY,
  limit: 9,
  period: {
    oneMonth: "1month",
    overall: "overall",
    sevenDays: "7day",
    sixMonths: "6month",
    threeMonths: "3month",
    twelveMonths: "12month",
  },
  user: "dancargill",
};

export async function getTopAlbums({
  user,
  gridSize,
  period,
}: {
  user: LastFMUser;
  gridSize: LastFMGridSize;
  period: LastFMPeriod;
}) {
  const limit = getLimit(gridSize);

  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&api_key=${env.LASTFM_API_KEY}&format=json`
  );

  const data = (await res.json()) as { topalbums: { album: Album[] } };

  return data.topalbums.album;
}

export const getLimit = (gridsize: LastFMGridSize) => {
  switch (gridsize) {
    case LastFMGridSize.three: {
      return LastFMLimit.nine;
    }
    case LastFMGridSize.four: {
      return LastFMLimit.sixteen;
    }
    case LastFMGridSize.five: {
      return LastFMLimit.twentyFive;
    }
    case LastFMGridSize.ten: {
      return LastFMLimit.oneHundred;
    }
  }
};
