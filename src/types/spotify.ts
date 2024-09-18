export enum SpotifyPeriod {
  short = 'short_term',
  medium = 'medium_term',
  long = 'long_term'
}

export enum SpotifyGridSize {
  three = '3',
  four = '4',
  five = '5',
  ten = '10'
}

export type SpotifyAlbum = {
  src: string
  name: string
  artist: string
}

export type SpotifyTrack = {
  album: {
    name: string
    images: { url: string }[]
  }
  artists: { name: string }[]
}
