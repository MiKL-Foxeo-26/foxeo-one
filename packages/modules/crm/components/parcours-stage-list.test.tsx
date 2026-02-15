import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ParcoursStageList } from './parcours-stage-list'

const mockStages = [
  { key: 'vision', name: 'Vision', description: 'Définir la vision business', order: 1 },
  { key: 'positionnement', name: 'Positionnement', description: 'Positionner l offre', order: 2 },
  { key: 'offre', name: 'Offre', description: 'Structurer l offre commerciale', order: 3 },
]

const mockActiveStages = [
  { key: 'vision', active: true },
  { key: 'positionnement', active: true },
  { key: 'offre', active: false },
]

describe('ParcoursStageList', () => {
  it('should render all stages', () => {
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={vi.fn()}
      />
    )

    expect(screen.getByText('Vision')).toBeInTheDocument()
    expect(screen.getByText('Positionnement')).toBeInTheDocument()
    expect(screen.getByText('Offre')).toBeInTheDocument()
  })

  it('should render stage descriptions', () => {
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={vi.fn()}
      />
    )

    expect(screen.getByText('Définir la vision business')).toBeInTheDocument()
  })

  it('should render stage order numbers', () => {
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={vi.fn()}
      />
    )

    expect(screen.getByText('Étape 1')).toBeInTheDocument()
    expect(screen.getByText('Étape 2')).toBeInTheDocument()
    expect(screen.getByText('Étape 3')).toBeInTheDocument()
  })

  it('should call onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={onToggle}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(onToggle).toHaveBeenCalledWith('vision', false)
  })

  it('should disable checkboxes when readOnly is true', () => {
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={vi.fn()}
        readOnly
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled()
    })
  })

  it('should have data-testid for each stage', () => {
    render(
      <ParcoursStageList
        stages={mockStages}
        activeStages={mockActiveStages}
        onToggle={vi.fn()}
      />
    )

    expect(screen.getByTestId('stage-vision')).toBeInTheDocument()
    expect(screen.getByTestId('stage-positionnement')).toBeInTheDocument()
    expect(screen.getByTestId('stage-offre')).toBeInTheDocument()
  })
})
