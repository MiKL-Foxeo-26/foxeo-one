'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMessages } from '../actions/get-messages'
import { sendMessage } from '../actions/send-message'
import type { Message, SendMessageInput } from '../types/chat.types'

export function useChatMessages(clientId: string) {
  const queryClient = useQueryClient()

  const messagesQuery = useQuery({
    queryKey: ['messages', clientId],
    queryFn: async () => {
      const { data, error } = await getMessages({ clientId })
      if (error) throw new Error(error.message)
      return data ?? []
    },
    enabled: !!clientId,
  })

  const sendMutation = useMutation({
    mutationFn: (input: SendMessageInput) => sendMessage(input),
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ['messages', clientId] })
      const previous = queryClient.getQueryData<Message[]>(['messages', clientId])

      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        clientId: newMessage.clientId,
        operatorId: newMessage.operatorId,
        senderType: newMessage.senderType,
        content: newMessage.content,
        readAt: null,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Message[]>(['messages', clientId], (old) => [
        ...(old ?? []),
        optimisticMessage,
      ])

      return { previous }
    },
    onError: (_err, _newMessage, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['messages', clientId], context.previous)
      }
    },
    // onSettled non nécessaire : Realtime fera l'invalidation
  })

  return {
    messages: messagesQuery.data ?? [],
    isPending: messagesQuery.isPending,
    isFetching: messagesQuery.isFetching,
    error: messagesQuery.error,
    sendMessage: sendMutation.mutate,
    sendMessageAsync: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    sendError: sendMutation.error,
  }
}
