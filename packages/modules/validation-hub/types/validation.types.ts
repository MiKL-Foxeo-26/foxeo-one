export type ValidationRequestType = 'brief_lab' | 'evolution_one'

export type ValidationRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_clarification'

export type ClientSummary = {
  id: string
  name: string
  company: string | null
  clientType: string
  avatarUrl: string | null
}

export type ValidationRequest = {
  id: string
  clientId: string
  operatorId: string
  parcoursId: string | null
  stepId: string | null
  type: ValidationRequestType
  title: string
  content: string
  documentIds: string[]
  status: ValidationRequestStatus
  reviewerComment: string | null
  submittedAt: string
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  // Relation jointe
  client?: ClientSummary
}

export type ValidationQueueFilters = {
  status: ValidationRequestStatus | 'all'
  type: ValidationRequestType | 'all'
  sortBy: 'submitted_at' | 'client_name'
  sortOrder: 'asc' | 'desc'
}

export const DEFAULT_VALIDATION_QUEUE_FILTERS: ValidationQueueFilters = {
  status: 'all',
  type: 'all',
  sortBy: 'submitted_at',
  sortOrder: 'asc',
}
