import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OneModuleCard, type OneModule } from './one-module-card'

const mockModule: OneModule = {
  id: 'crm',
  name: 'CRM',
  description: 'Gérez vos contacts, clients et opportunités',
  icon: '👥',
}

describe('OneModuleCard', () => {
  it('affiche le nom du module', () => {
    render(<OneModuleCard module={mockModule} />)
    expect(screen.getByText('CRM')).toBeInTheDocument()
  })

  it('affiche la description du module', () => {
    render(<OneModuleCard module={mockModule} />)
    expect(screen.getByText('Gérez vos contacts, clients et opportunités')).toBeInTheDocument()
  })

  it("affiche l'icône du module", () => {
    render(<OneModuleCard module={mockModule} />)
    expect(screen.getByText('👥')).toBeInTheDocument()
  })

  it('affiche correctement un module Documents', () => {
    const docsModule: OneModule = {
      id: 'documents',
      name: 'Documents',
      description: 'Stockez et partagez vos fichiers',
      icon: '📄',
    }
    render(<OneModuleCard module={docsModule} />)
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('📄')).toBeInTheDocument()
  })

  it('affiche correctement le module Élio+', () => {
    const elioModule: OneModule = {
      id: 'elio',
      name: 'Élio+',
      description: 'Assistant IA avancé',
      icon: '🤖',
    }
    render(<OneModuleCard module={elioModule} />)
    expect(screen.getByText('Élio+')).toBeInTheDocument()
    expect(screen.getByText('🤖')).toBeInTheDocument()
  })
})
