import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePostMeetingDialog } from './use-post-meeting-dialog'

const MEETING_ID = '00000000-0000-0000-0000-000000000001'

describe('usePostMeetingDialog', () => {
  it('initializes with dialog closed and no meetingId', () => {
    const { result } = renderHook(() => usePostMeetingDialog())
    expect(result.current.dialogState.isOpen).toBe(false)
    expect(result.current.dialogState.meetingId).toBeNull()
  })

  it('opens dialog with meetingId', () => {
    const { result } = renderHook(() => usePostMeetingDialog())
    act(() => {
      result.current.openDialog(MEETING_ID)
    })
    expect(result.current.dialogState.isOpen).toBe(true)
    expect(result.current.dialogState.meetingId).toBe(MEETING_ID)
  })

  it('closes dialog and clears meetingId', () => {
    const { result } = renderHook(() => usePostMeetingDialog())
    act(() => {
      result.current.openDialog(MEETING_ID)
    })
    act(() => {
      result.current.closeDialog()
    })
    expect(result.current.dialogState.isOpen).toBe(false)
    expect(result.current.dialogState.meetingId).toBeNull()
  })

  it('can open with different meetingId', () => {
    const OTHER_ID = '00000000-0000-0000-0000-000000000099'
    const { result } = renderHook(() => usePostMeetingDialog())
    act(() => {
      result.current.openDialog(MEETING_ID)
    })
    act(() => {
      result.current.openDialog(OTHER_ID)
    })
    expect(result.current.dialogState.meetingId).toBe(OTHER_ID)
  })
})
