'use client'

import { useState, useCallback } from 'react'

export interface PostMeetingDialogState {
  isOpen: boolean
  meetingId: string | null
}

export interface UsePostMeetingDialogReturn {
  dialogState: PostMeetingDialogState
  openDialog: (meetingId: string) => void
  closeDialog: () => void
}

/**
 * Gère l'état du dialog post-visio pour les meetings de type 'prospect'.
 * À utiliser dans le composant parent après appel à endMeeting().
 * Si result.data.type === 'prospect', appeler openDialog(meetingId).
 */
export function usePostMeetingDialog(): UsePostMeetingDialogReturn {
  const [dialogState, setDialogState] = useState<PostMeetingDialogState>({
    isOpen: false,
    meetingId: null,
  })

  const openDialog = useCallback((meetingId: string) => {
    setDialogState({ isOpen: true, meetingId })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState({ isOpen: false, meetingId: null })
  }, [])

  return { dialogState, openDialog, closeDialog }
}
