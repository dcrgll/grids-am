'use client'

import { useState } from 'react'
import Image from 'next/image'

import { type Album } from '@/types/album'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ImageGrid from '@/components/image-grid'
import LastFMForm from '@/components/lastfm-form'

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [cols, setCols] = useState<number>(3)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  return (
    <main className="flex min-h-screen flex-col p-4 xl:p-24">
      <div className="container">
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="w-full xl:w-2/5">
            <Card className="mx-auto w-full xl:max-w-md">
              <CardHeader>
                <CardTitle>Last.fm Collage Generator</CardTitle>
                <CardDescription>
                  Generate a collage of your most listened to albums from
                  Last.fm.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LastFMForm setAlbums={setAlbums} setCols={setCols} />
              </CardContent>
            </Card>
            <p className="mt-2 text-center text-sm text-gray-500">
              <a href="https://last.fm/user/dancargill">
                What a pain in the ass Last.fm is.
              </a>
            </p>

            {dataUrl && (
              <Button
                onClick={() => triggerShare(dataUrl)}
                className="mt-4 w-full"
                variant="link"
              >
                ✨ Share this thing ✨
              </Button>
            )}

            <Image
              src="/headphones.png"
              alt="Last.fm Collage"
              className="fixed -bottom-8 -left-8 hidden -scale-x-100 xl:block"
              width={300}
              height={300}
            />
          </div>
          <div className="flex w-full justify-center">
            {albums.length > 0 ? (
              <ImageGrid
                albums={albums}
                cols={cols}
                dataUrl={dataUrl}
                setDataUrl={setDataUrl}
              />
            ) : (
              <Skeleton className="h-[900px] w-[900px] rounded-xl" />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1] ?? '')
  // separate out the mime component
  const mimeString = dataURI.split(',')[0]?.split(':')[1]?.split(';')[0] ?? ''

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  const ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  return blob
}

async function triggerShare(dataUrl: string) {
  const blob = dataURItoBlob(dataUrl)

  const filesArray = [
    new File([blob], 'lastfm-collage.png', {
      type: 'image/png',
      lastModified: Date.now()
    })
  ]

  const shareData = {
    title: 'Last.fm Collage',
    files: filesArray,
    url: document.location.origin
  }

  if (navigator?.canShare(shareData)) {
    await navigator.share(shareData)
  }
}
