'use client'

import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendGAEvent } from '@next/third-parties/google'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { type Album } from '@/types/album'
import { LastFMGridSize, LastFMPeriod } from '@/types/lastfm'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),

  period: z.string(),
  gridSize: z.string()
})

const periods = {
  [LastFMPeriod.sevenDays]: {
    label: '7 Days',
    value: LastFMPeriod.sevenDays
  },
  [LastFMPeriod.oneMonth]: {
    label: '1 Month',
    value: LastFMPeriod.oneMonth
  },
  [LastFMPeriod.threeMonths]: {
    label: '3 Months',
    value: LastFMPeriod.threeMonths
  },
  [LastFMPeriod.sixMonths]: {
    label: '6 Months',
    value: LastFMPeriod.sixMonths
  },
  [LastFMPeriod.twelveMonths]: {
    label: '12 Months',
    value: LastFMPeriod.twelveMonths
  }
}

const gridSize = {
  3: {
    label: '3 x 3',
    value: LastFMGridSize.three
  },
  4: {
    label: '4 x 4',
    value: LastFMGridSize.four
  },
  5: {
    label: '5 x 5',
    value: LastFMGridSize.five
  }
}

export default function LastFMForm({
  setAlbums,
  setCols
}: {
  setAlbums: (albums: Album[]) => void
  setCols: (cols: number) => void
}) {
  const { mutate, isPending } = api.lastfm.getTopAlbums.useMutation({
    onSuccess: async (data) => {
      setAlbums(data.response)
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      period: LastFMPeriod.sevenDays,
      gridSize: LastFMGridSize.three
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAlbums([])
    sendGAEvent('event', 'form_submitted', { value: values.username })

    setCols(parseInt(values.gridSize))
    mutate({
      username: values.username,
      period: values.period,
      gridSize: values.gridSize
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
