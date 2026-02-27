import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useElioChat } from './use-elio-chat'

const mockSendToElio = vi.fn()

vi.mock('../actions/send-to-elio', () => ({
  sendToElio: (...args: unknown[]) => mockSendToElio(...args),
}))

describe('useElioChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initialise avec un tableau messages vide et isLoading=false', () => {
    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab', clientId: 'c-1' }))
    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('ajoute un message utilisateur et la réponse Élio après sendMessage', async () => {
    mockSendToElio.mockResolvedValueOnce({
      data: {
        id: 'msg-elio',
        role: 'assistant',
        content: 'Bonjour !',
        createdAt: new Date().toISOString(),
        dashboardType: 'lab',
      },
      error: null,
    })

    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab', clientId: 'c-1' }))

    await act(async () => {
      await result.current.sendMessage('Bonjour Élio')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[0].content).toBe('Bonjour Élio')
    expect(result.current.messages[1].role).toBe('assistant')
    expect(result.current.messages[1].content).toBe('Bonjour !')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('ne fait rien si le message est vide', async () => {
    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab' }))

    await act(async () => {
      await result.current.sendMessage('   ')
    })

    expect(mockSendToElio).not.toHaveBeenCalled()
    expect(result.current.messages).toHaveLength(0)
  })

  it('set error si sendToElio retourne une erreur', async () => {
    mockSendToElio.mockResolvedValueOnce({
      data: null,
      error: { message: 'Élio est surchargé.', code: 'LLM_ERROR' },
    })

    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab', clientId: 'c-1' }))

    await act(async () => {
      await result.current.sendMessage('Test')
    })

    expect(result.current.error?.code).toBe('LLM_ERROR')
    expect(result.current.messages).toHaveLength(1) // seul le message user est ajouté
  })

  it('retrySend renvoie le dernier message', async () => {
    mockSendToElio
      .mockResolvedValueOnce({ data: null, error: { code: 'LLM_ERROR', message: 'Erreur' } })
      .mockResolvedValueOnce({
        data: {
          id: 'retry-1',
          role: 'assistant',
          content: 'Réponse après retry',
          createdAt: new Date().toISOString(),
          dashboardType: 'lab',
        },
        error: null,
      })

    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab', clientId: 'c-1' }))

    await act(async () => {
      await result.current.sendMessage('Ma question')
    })
    expect(result.current.error).toBeDefined()

    await act(async () => {
      await result.current.retrySend()
    })

    expect(result.current.error).toBeNull()
  })

  it('clearError remet l\'erreur à null', async () => {
    mockSendToElio.mockResolvedValueOnce({
      data: null,
      error: { message: 'Erreur', code: 'UNKNOWN' },
    })

    const { result } = renderHook(() => useElioChat({ dashboardType: 'lab' }))

    await act(async () => {
      await result.current.sendMessage('Test')
    })
    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })
})
