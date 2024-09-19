'use client'

import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
// import { sendGAEvent } from '@next/third-parties/google'

import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  SpotifyGridSize,
  SpotifyPeriod,
  type SpotifyAlbum
} from '@/types/spotify'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const formSchema = z.object({
  period: z.string(),
  gridSize: z.string(),
  labels: z.boolean(),
  authToken: z.string()
})

const periods = {
  [SpotifyPeriod.short]: {
    label: 'Last 4 Weeks',
    value: SpotifyPeriod.short
  },
  [SpotifyPeriod.medium]: {
    label: 'Last 6 Months',
    value: SpotifyPeriod.medium
  },
  [SpotifyPeriod.long]: {
    label: 'Last Year',
    value: SpotifyPeriod.long
  }
}

const gridSize = {
  3: {
    label: '3 x 3',
    value: SpotifyGridSize.three
  },
  4: {
    label: '4 x 4',
    value: SpotifyGridSize.four
  },
  5: {
    label: '5 x 5',
    value: SpotifyGridSize.five
  }
}

export default function SpotifyForm({
  authToken,
  setAlbums,
  setCols,
  setLabels
}: {
  authToken: string
  setAlbums: (albums: SpotifyAlbum[]) => void
  setCols: (cols: number) => void
  setLabels: (labels: boolean) => void
}) {
  const { mutate, isPending } = api.spotify.getTopAlbums.useMutation({
    onSuccess: ({ response }) => {
      setAlbums(response)
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: SpotifyPeriod.short,
      gridSize: SpotifyGridSize.five,
      labels: false,
      authToken: authToken
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAlbums([])

    // sendGAEvent('event', 'form_submitted', { value: values.username })
    setCols(parseInt(values.gridSize))
    setLabels(values.labels)

    mutate({
      period: values.period,
      authToken
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(periods).map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gridSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grid Size</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(gridSize).map(
                      (size: { label: string; value: string }) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem className="my-2 flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="leading-none">
                <FormLabel className="text-sm font-normal">
                  Display album/artist labels?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-green-600 text-white hover:bg-green-700"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Create Spotify Collage'
          )}
        </Button>
      </form>
    </Form>
  )
}
