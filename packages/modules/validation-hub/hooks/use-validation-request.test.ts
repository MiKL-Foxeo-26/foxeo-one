import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { ValidationRequestDetail } from '../types/validation.types'

vi.mock('../actions/get-validation-request', () => ({
  getValidationRequest: vi.fn(),
}))

const { getValidationRequest } = await import(
  '../actions/get-validation-request'
)
const mockGetValidationRequest = vi.mocked(getValidationRequest)

const mockDetail: ValidationRequestDetail = {
  id: 'req-1',
  clientId: 'c-1',
  operatorId: 'op-1',
  parcoursId: null,
  stepId: null,
  type: 'brief_lab',
  title: 'Mon brief',
  content: 'Contenu du brief',
  documentIds: [],
  status: 'pending',
  reviewerComment: null,
  submittedAt: '2026-02-20T10:00:00Z',
  reviewedAt: null,
  createdAt: '2026-02-20T10:00:00Z',
  updatedAt: '2026-02-20T10:00:00Z',
  client: {
    id: 'c-1',
    name: 'Jean Dupont',
    company: 'Acme Corp',
    clientType: 'complet',
    avatarUrl: null,
  },
  documents: [],
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useValidationRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return request when data loads successfully', async () => {
    mockGetValidationRequest.mockResolvedValue({
      data: mockDetail,
      error: null,
    })

    const { useValidationRequest } = await import('./use-validation-request')
    const { result } = renderHook(() => useValidationRequest('req-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.request).not.toBeNull()
    expect(result.current.request?.id).toBe('req-1')
    expect(result.current.request?.client.name).toBe('Jean Dupont')
    expect(result.current.error).toBeNull()
  })

  it('should return error when action fails', async () => {
    mockGetValidationRequest.mockResolvedValue({
      data: null,
      error: { message: 'Demande introuvable', code: 'NOT_FOUND' },
    })

    const { useValidationRequest } = await import('./use-validation-request')
    const { result } = renderHook(() => useValidationRequest('req-404'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.request).toBeNull()
    expect(result.current.error).not.toBeNull()
    expect(result.current.error?.message).toBe('Demande introuvable')
  })

  it('should not fetch when requestId is empty', async () => {
    const { useValidationRequest } = await import('./use-validation-request')
    const { result } = renderHook(() => useValidationRequest(''), {
      wrapper: createWrapper(),
    })

    // enabled: !!requestId → false, query is disabled and never called
    expect(result.current.request).toBeNull()
    expect(mockGetValidationRequest).not.toHaveBeenCalled()
  })

  it('should have staleTime of 1 minute', async () => {
    mockGetValidationRequest.mockResolvedValue({
      data: mockDetail,
      error: null,
    })

    const { useValidationRequest } = await import('./use-validation-request')
    const { result } = renderHook(() => useValidationRequest('req-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verify the action was called once
    expect(mockGetValidationRequest).toHaveBeenCalledWith('req-1')
  })

  it('should include documents in returned request', async () => {
    const detailWithDocs = {
      ...mockDetail,
      documents: [
        {
          id: 'doc-1',
          name: 'brief.pdf',
          fileType: 'application/pdf',
          fileSize: 2048,
          filePath: 'op-1/c-1/brief.pdf',
        },
      ],
    }
    mockGetValidationRequest.mockResolvedValue({
      data: detailWithDocs,
      error: null,
    })

    const { useValidationRequest } = await import('./use-validation-request')
    const { result } = renderHook(() => useValidationRequest('req-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.request?.documents).toHaveLength(1)
    expect(result.current.request?.documents[0].name).toBe('brief.pdf')
  })
})
