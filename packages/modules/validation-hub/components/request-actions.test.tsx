import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

describe('RequestActions', () => {
  const mockHandlers = {
    onValidate: vi.fn(),
    onRefuse: vi.fn(),
    onRequestClarification: vi.fn(),
    onTreatmentAction: vi.fn(),
  }

  async function importComponent() {
    const { RequestActions } = await import('./request-actions')
    return RequestActions
  }

  it('should render all 4 action buttons', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="pending"
        {...mockHandlers}
      />
    )
    expect(screen.getByText(/Valider/)).toBeDefined()
    expect(screen.getByText(/Refuser/)).toBeDefined()
    expect(screen.getByText(/Demander des précisions/)).toBeDefined()
    expect(screen.getByText(/Actions de traitement/)).toBeDefined()
  })

  it('should enable all buttons when status is pending', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="pending"
        {...mockHandlers}
      />
    )
    const validateBtn = screen.getByText(/Valider/).closest('button')
    const refuseBtn = screen.getByText(/Refuser/).closest('button')
    const clarifyBtn = screen.getByText(/Demander des précisions/).closest('button')

    expect(validateBtn?.disabled).toBe(false)
    expect(refuseBtn?.disabled).toBe(false)
    expect(clarifyBtn?.disabled).toBe(false)
  })

  it('should enable all buttons when status is needs_clarification', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="needs_clarification"
        {...mockHandlers}
      />
    )
    const validateBtn = screen.getByText(/Valider/).closest('button')
    expect(validateBtn?.disabled).toBe(false)
  })

  it('should disable validate/refuse/clarify buttons when status is approved', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="approved"
        {...mockHandlers}
      />
    )
    const validateBtn = screen.getByText(/Valider/).closest('button')
    const refuseBtn = screen.getByText(/Refuser/).closest('button')
    const clarifyBtn = screen.getByText(/Demander des précisions/).closest('button')

    expect(validateBtn?.disabled).toBe(true)
    expect(refuseBtn?.disabled).toBe(true)
    expect(clarifyBtn?.disabled).toBe(true)
  })

  it('should call onValidate when Valider button clicked', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="pending"
        {...mockHandlers}
      />
    )
    fireEvent.click(screen.getByText(/Valider/).closest('button')!)
    expect(mockHandlers.onValidate).toHaveBeenCalled()
  })

  it('should call onRefuse when Refuser button clicked', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="pending"
        {...mockHandlers}
      />
    )
    fireEvent.click(screen.getByText(/Refuser/).closest('button')!)
    expect(mockHandlers.onRefuse).toHaveBeenCalled()
  })

  it('should call onRequestClarification when clarify button clicked', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="pending"
        {...mockHandlers}
      />
    )
    fireEvent.click(screen.getByText(/Demander des précisions/).closest('button')!)
    expect(mockHandlers.onRequestClarification).toHaveBeenCalled()
  })

  it('should keep treatment actions button active on approved status', async () => {
    const RequestActions = await importComponent()
    render(
      <RequestActions
        status="approved"
        {...mockHandlers}
      />
    )
    const treatBtn = screen.getByText(/Actions de traitement/).closest('button')
    expect(treatBtn?.disabled).toBe(false)
  })
})
