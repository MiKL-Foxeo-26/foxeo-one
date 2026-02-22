import { describe, it, expect, vi } from 'vitest'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((options) => ({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
  })),
}))

vi.mock('../actions/get-meeting-requests', () => ({
  getMeetingRequests: vi.fn(),
}))

describe('useMeetingRequests', () => {
  it('creates query with correct key (no filter)', async () => {
    const { useMeetingRequests } = await import('./use-meeting-requests')
    const result = useMeetingRequests() as unknown as { queryKey: string[]; queryFn: () => Promise<unknown> }

    expect(result.queryKey).toEqual(['meeting-requests', 'all'])
  })

  it('creates query with status filter', async () => {
    const { useMeetingRequests } = await import('./use-meeting-requests')
    const result = useMeetingRequests({ status: 'pending' }) as unknown as { queryKey: string[]; queryFn: () => Promise<unknown> }

    expect(result.queryKey).toEqual(['meeting-requests', 'pending'])
  })

  it('queryFn calls getMeetingRequests and returns data', async () => {
    const { getMeetingRequests } = await import('../actions/get-meeting-requests')
    const mockData = [{ id: '1', status: 'pending', clientId: 'c1' }]
    vi.mocked(getMeetingRequests).mockResolvedValue({ data: mockData, error: null })

    const { useMeetingRequests } = await import('./use-meeting-requests')
    const result = useMeetingRequests() as unknown as { queryKey: string[]; queryFn: () => Promise<unknown> }

    const data = await result.queryFn()
    expect(data).toEqual(mockData)
  })

  it('queryFn throws on error', async () => {
    const { getMeetingRequests } = await import('../actions/get-meeting-requests')
    vi.mocked(getMeetingRequests).mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'DB_ERROR' },
    })

    const { useMeetingRequests } = await import('./use-meeting-requests')
    const result = useMeetingRequests() as unknown as { queryKey: string[]; queryFn: () => Promise<unknown> }

    await expect(result.queryFn()).rejects.toThrow('DB error')
  })
})
