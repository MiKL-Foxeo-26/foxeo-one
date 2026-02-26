'use client'

import { useQuery } from '@tanstack/react-query'
import { getSubmissions } from '../actions/get-submissions'
import type { StepSubmissionWithStep, SubmissionStatus } from '../types/parcours.types'

interface UseStepSubmissionsOptions {
  stepId?: string
  clientId?: string
  status?: SubmissionStatus
}

export function useStepSubmissions({ stepId, clientId, status }: UseStepSubmissionsOptions) {
  return useQuery<StepSubmissionWithStep[]>({
    queryKey: ['step-submissions', stepId, clientId, status],
    queryFn: async () => {
      const { data, error } = await getSubmissions({ stepId, clientId, status })
      if (error) throw new Error(error.message)
      return data ?? []
    },
    enabled: Boolean(stepId) || Boolean(clientId),
    staleTime: 30_000,
  })
}
