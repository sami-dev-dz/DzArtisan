"use client"

import useSWR from 'swr'
import axios from "@/lib/axios"

const fetcher = url => axios.get(url).then(res => res.data)

export function useAdminOverview() {
  const { data, error, isLoading, mutate } = useSWR('/v1/admin/overview', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    data: data?.data || data,
    loading: isLoading,
    error: error?.response?.data?.message || error?.message || null,
    refresh: mutate
  }
}
