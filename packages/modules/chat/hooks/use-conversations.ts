'use client'

import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../actions/get-conversations'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await getConversations()
      if (error) throw new Error(error.message)
      return data ?? []
    },
  })
}
