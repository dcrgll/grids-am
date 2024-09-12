export type Album = {
  name: string
  artist: { name: string }
  url: string
  image: {
    size: string
    '#text': string
  }[]
}

export type Albums = Album[]
