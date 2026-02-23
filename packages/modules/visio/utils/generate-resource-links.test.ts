import { describe, it, expect, vi } from 'vitest'
import { generateResourceLinks } from './generate-resource-links'
import type { SupabaseClient } from '@supabase/supabase-js'

const DOC_ID_1 = '00000000-0000-0000-0000-000000000001'
const DOC_ID_2 = '00000000-0000-0000-0000-000000000002'

describe('generateResourceLinks', () => {
  it('returns empty array when documentIds is empty', async () => {
    const supabase = {} as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [])
    expect(result).toEqual([])
  })

  it('returns empty array when batch document fetch fails', async () => {
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
        }),
      }),
      storage: { from: vi.fn() },
    } as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [DOC_ID_1])
    expect(result).toEqual([])
  })

  it('skips documents without file_path', async () => {
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [{ id: DOC_ID_1, name: 'NoPath.pdf', file_path: null }],
            error: null,
          }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn(),
        }),
      },
    } as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [DOC_ID_1])
    expect(result).toEqual([])
  })

  it('skips document when signed URL generation fails', async () => {
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [{ id: DOC_ID_1, name: 'Test.pdf', file_path: 'operator/client/test.pdf' }],
            error: null,
          }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockResolvedValue({ data: null, error: new Error('Storage error') }),
        }),
      },
    } as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [DOC_ID_1])
    expect(result).toEqual([])
  })

  it('returns resource links for valid documents', async () => {
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [{ id: DOC_ID_1, name: 'Guide.pdf', file_path: 'op/cl/guide.pdf' }],
            error: null,
          }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockResolvedValue({
            data: { signedUrl: 'https://storage.supabase.co/signed/guide.pdf' },
            error: null,
          }),
        }),
      },
    } as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [DOC_ID_1])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Guide.pdf')
    expect(result[0].url).toBe('https://storage.supabase.co/signed/guide.pdf')
  })

  it('processes multiple documents in a single batch query', async () => {
    const mockIn = vi.fn().mockResolvedValue({
      data: [
        { id: DOC_ID_1, name: 'Doc1.pdf', file_path: 'path/doc1.pdf' },
        { id: DOC_ID_2, name: 'Doc2.pdf', file_path: 'path/doc2.pdf' },
      ],
      error: null,
    })
    const mockCreateSignedUrl = vi.fn().mockImplementation(async (path: string) => ({
      data: { signedUrl: `https://storage/${path}` },
      error: null,
    }))
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ in: mockIn }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({ createSignedUrl: mockCreateSignedUrl }),
      },
    } as unknown as SupabaseClient
    const result = await generateResourceLinks(supabase, [DOC_ID_1, DOC_ID_2])
    expect(result).toHaveLength(2)
    // Verify batch: .in() called once with both IDs
    expect(mockIn).toHaveBeenCalledWith('id', [DOC_ID_1, DOC_ID_2])
  })
})
