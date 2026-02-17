import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatList } from './chat-list'

const mockUseConversations = vi.fn()

vi.mock('../hooks/use-conversations', () => ({
  useConversations: (...args: unknown[]) => mockUseConversations(...args),
}))

const defaultConversations = {
  data: [
    {
      clientId: 'client-a',
      clientName: 'Alice Martin',
      clientEmail: 'alice@test.com',
      lastMessage: 'Bonjour !',
      lastMessageAt: '2026-02-17T09:00:00Z',
      unreadCount: 2,
    },
    {
      clientId: 'client-b',
      clientName: 'Bob Dupont',
      clientEmail: 'bob@test.com',
      lastMessage: 'Merci',
      lastMessageAt: '2026-02-17T08:00:00Z',
      unreadCount: 0,
    },
  ],
  isPending: false,
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('ChatList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseConversations.mockReturnValue(defaultConversations)
  })

  it('renders list of conversations', () => {
    render(<ChatList onSelectClient={vi.fn()} />, { wrapper })
    expect(screen.getByTestId('chat-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('conversation-item')).toHaveLength(2)
  })

  it('shows client names', () => {
    render(<ChatList onSelectClient={vi.fn()} />, { wrapper })
    expect(screen.getByText('Alice Martin')).toBeInTheDocument()
    expect(screen.getByText('Bob Dupont')).toBeInTheDocument()
  })

  it('shows unread badge for conversations with unread messages', () => {
    render(<ChatList onSelectClient={vi.fn()} />, { wrapper })
    expect(screen.getByLabelText('2 non lus')).toBeInTheDocument()
  })

  it('calls onSelectClient with correct clientId on click', async () => {
    const user = userEvent.setup()
    const onSelectClient = vi.fn()
    render(<ChatList onSelectClient={onSelectClient} />, { wrapper })
    const items = screen.getAllByTestId('conversation-item')
    await user.click(items[0])
    expect(onSelectClient).toHaveBeenCalledWith('client-a')
  })

  it('marks selected conversation with aria-selected', () => {
    render(
      <ChatList selectedClientId="client-a" onSelectClient={vi.fn()} />,
      { wrapper }
    )
    const items = screen.getAllByTestId('conversation-item')
    expect(items[0]).toHaveAttribute('aria-selected', 'true')
    expect(items[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('shows skeleton when loading', () => {
    mockUseConversations.mockReturnValue({ data: undefined, isPending: true })
    render(<ChatList onSelectClient={vi.fn()} />, { wrapper })
    expect(screen.getByTestId('chat-list-skeleton')).toBeInTheDocument()
  })
})
