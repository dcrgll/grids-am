'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/trpc/react'
import { skipToken } from '@tanstack/react-query'

import { type SpotifyAlbum } from '@/types/spotify'
import { getAuthTokenFromHash } from '@/lib/spotify'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import LoginWithSpotifyButton from '@/components/login-with-spotify'
import SpotifyForm from '@/components/spotify-form'
import SpotifyImageGrid from '@/components/spotify-image-grid'

export default function SpotifyPage() {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([])
  const [cols, setCols] = useState<number>(3)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [labels, setLabels] = useState<boolean>(true)
  const [authToken, setAuthToken] = useState<string>('')

  const { data: userData, refetch } = api.spotify.getUserData.useQuery(
    authToken
      ? {
          authToken
        }
      : skipToken
  )

  useEffect(() => {
    const _token = getAuthTokenFromHash()

    if (_token) {
      setAuthToken(_token)
    }
  }, [])

  useEffect(() => {
    if (authToken) {
      void refetch()
    }
  }, [authToken, refetch])

  return (
    <main className="flex min-h-screen flex-col p-4 xl:p-24">
      <div className="container">
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="w-full xl:w-2/5">
            <Card className="mx-auto w-full xl:max-w-md">
              <CardHeader>
                <CardTitle>Spotify Collage Generator</CardTitle>
                <CardDescription>
                  {userData?.response
                    ? `Hey ${userData?.response?.display_name?.split(' ')[0]}, you can generate a collage of your most listened to albums from Spotify.`
                    : ' Generate a collage of your most listened to albums from Spotify.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData?.response ? (
                  <SpotifyForm
                    setAlbums={setAlbums}
                    setCols={setCols}
                    authToken={authToken}
                    setLabels={setLabels}
                  />
                ) : (
                  <LoginWithSpotifyButton />
                )}
              </CardContent>
            </Card>
            <p className="mt-2 text-center text-sm text-gray-500">
              <Link href="/">Want the Last.fm version?</Link>
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
              <SpotifyImageGrid
                albums={albums}
                cols={cols}
                dataUrl={dataUrl}
                setDataUrl={setDataUrl}
                labels={labels}
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
