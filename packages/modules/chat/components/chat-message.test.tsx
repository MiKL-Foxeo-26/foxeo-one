import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from './chat-message'
import type { Message } from '../types/chat.types'

const baseMessage: Message = {
  id: 'msg-1',
  clientId: 'client-id',
  operatorId: 'op-id',
  senderType: 'operator',
  content: 'Hello from MiKL',
  readAt: null,
  createdAt: '2026-02-17T10:00:00Z',
}

describe('ChatMessage', () => {
  it('renders message content', () => {
    render(<ChatMessage message={baseMessage} currentUserType="client" />)
    expect(screen.getByText('Hello from MiKL')).toBeInTheDocument()
  })

  it('aligns operator message to the left (not own message for client)', () => {
    render(<ChatMessage message={baseMessage} currentUserType="client" />)
    const container = screen.getByTestId('chat-message')
    expect(container).toHaveClass('flex-row')
    expect(container).not.toHaveClass('flex-row-reverse')
  })

  it('aligns operator message to the right (own message for operator)', () => {
    render(<ChatMessage message={baseMessage} currentUserType="operator" />)
    const container = screen.getByTestId('chat-message')
    expect(container).toHaveClass('flex-row-reverse')
  })

  it('shows unread indicator (single check) when readAt is null and is own message', () => {
    const msg = { ...baseMessage, readAt: null }
    render(<ChatMessage message={msg} currentUserType="operator" />)
    expect(screen.getByLabelText('Non lu')).toBeInTheDocument()
  })

  it('shows read indicator (double check) when readAt is set and is own message', () => {
    const msg = { ...baseMessage, readAt: '2026-02-17T10:05:00Z' }
    render(<ChatMessage message={msg} currentUserType="operator" />)
    expect(screen.getByLabelText('Lu')).toBeInTheDocument()
  })

  it('renders client message correctly', () => {
    const clientMsg: Message = {
      ...baseMessage,
      senderType: 'client',
      content: 'Hello from client',
    }
    render(<ChatMessage message={clientMsg} currentUserType="client" />)
    expect(screen.getByText('Hello from client')).toBeInTheDocument()
  })

  it('sets data-sender attribute correctly', () => {
    render(<ChatMessage message={baseMessage} currentUserType="client" />)
    expect(screen.getByTestId('chat-message')).toHaveAttribute('data-sender', 'operator')
  })
})
