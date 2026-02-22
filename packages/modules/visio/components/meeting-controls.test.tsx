import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MeetingControls } from './meeting-controls'

describe('MeetingControls', () => {
  const defaultProps = {
    isMuted: false,
    isCameraOff: false,
    isScreenSharing: false,
    onToggleMute: vi.fn(),
    onToggleCamera: vi.fn(),
    onToggleScreenShare: vi.fn(),
    onLeave: vi.fn(),
  }

  it('renders all control buttons', () => {
    render(<MeetingControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: /micro/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /cam/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /partage/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /quitter/i })).toBeDefined()
  })

  it('calls onToggleMute when mute button clicked', () => {
    const onToggleMute = vi.fn()
    render(<MeetingControls {...defaultProps} onToggleMute={onToggleMute} />)

    fireEvent.click(screen.getByRole('button', { name: /micro/i }))
    expect(onToggleMute).toHaveBeenCalledOnce()
  })

  it('calls onToggleCamera when camera button clicked', () => {
    const onToggleCamera = vi.fn()
    render(<MeetingControls {...defaultProps} onToggleCamera={onToggleCamera} />)

    fireEvent.click(screen.getByRole('button', { name: /cam/i }))
    expect(onToggleCamera).toHaveBeenCalledOnce()
  })

  it('calls onToggleScreenShare when screen share button clicked', () => {
    const onToggleScreenShare = vi.fn()
    render(<MeetingControls {...defaultProps} onToggleScreenShare={onToggleScreenShare} />)

    fireEvent.click(screen.getByRole('button', { name: /partage/i }))
    expect(onToggleScreenShare).toHaveBeenCalledOnce()
  })

  it('calls onLeave when leave button clicked', () => {
    const onLeave = vi.fn()
    render(<MeetingControls {...defaultProps} onLeave={onLeave} />)

    fireEvent.click(screen.getByRole('button', { name: /quitter/i }))
    expect(onLeave).toHaveBeenCalledOnce()
  })

  it('shows muted state visually when isMuted is true', () => {
    render(<MeetingControls {...defaultProps} isMuted={true} />)
    const muteButton = screen.getByRole('button', { name: /micro/i })
    expect(muteButton.getAttribute('data-muted')).toBe('true')
  })

  it('shows camera off state when isCameraOff is true', () => {
    render(<MeetingControls {...defaultProps} isCameraOff={true} />)
    const cameraButton = screen.getByRole('button', { name: /cam/i })
    expect(cameraButton.getAttribute('data-off')).toBe('true')
  })
})
