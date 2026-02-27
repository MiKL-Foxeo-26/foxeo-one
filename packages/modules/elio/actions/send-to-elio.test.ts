import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendToElio } from './send-to-elio'
import { DEFAULT_ELIO_CONFIG } from '../types/elio-config.types'

const mockInvoke = vi.fn()

vi.mock('@foxeo/supabase', () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: 'user-1' } }, error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: { id: 'client-1' }, error: null })),
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
    })),
    functions: {
      invoke: mockInvoke,
    },
  })),
}))

vi.mock('./get-elio-config', () => ({
  getElioConfig: vi.fn(async () => ({ data: DEFAULT_ELIO_CONFIG, error: null })),
}))

describe('sendToElio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne { data, error: null } en cas de succès', async () => {
    mockInvoke.mockResolvedValueOnce({
      data: { content: 'Bonjour ! Je suis Élio.' },
      error: null,
    })

    const result = await sendToElio('lab', 'Bonjour Élio', 'client-1')

    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    expect(result.data?.role).toBe('assistant')
    expect(result.data?.content).toBe('Bonjour ! Je suis Élio.')
    expect(result.data?.dashboardType).toBe('lab')
  })

  it('retourne une erreur VALIDATION_ERROR si le message est vide', async () => {
    const result = await sendToElio('lab', '   ', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })

  it('retourne une erreur TIMEOUT si l\'Edge Function signale un timeout', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('Request timed out'))

    const result = await sendToElio('lab', 'Question test', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('TIMEOUT')
    expect(result.error?.message).toContain('temporairement indisponible')
  })

  it('retourne une erreur NETWORK_ERROR si problème réseau', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('fetch failed: network error'))

    const result = await sendToElio('lab', 'Question test', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('NETWORK_ERROR')
    expect(result.error?.message).toContain('connexion')
  })

  it('retourne une erreur LLM_ERROR si rate limit', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('rate limit exceeded'))

    const result = await sendToElio('lab', 'Question test', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('LLM_ERROR')
    expect(result.error?.message).toContain('surchargé')
  })

  it('retourne une erreur UNKNOWN pour les erreurs inattendues', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('Something totally unexpected'))

    const result = await sendToElio('lab', 'Question test', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('UNKNOWN')
  })

  it('fonctionne pour le dashboard hub (sans clientId)', async () => {
    mockInvoke.mockResolvedValueOnce({
      data: { content: 'Voici les stats clients...' },
      error: null,
    })

    const result = await sendToElio('hub', 'Montre-moi les clients actifs')
    expect(result.error).toBeNull()
    expect(result.data?.dashboardType).toBe('hub')
  })

  it('retourne une erreur si l\'Edge Function retourne une erreur', async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: new Error('Edge Function error: 500'),
    })

    const result = await sendToElio('lab', 'Question test', 'client-1')
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })
})
