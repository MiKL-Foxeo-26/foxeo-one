import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GraduationRecap } from './graduation-recap'

describe('GraduationRecap', () => {
  it('affiche "Parcours complété" quand firstLoginAt est null', () => {
    render(<GraduationRecap firstLoginAt={null} graduatedAt="2026-02-24T10:00:00Z" />)
    expect(screen.getByText('Parcours complété')).toBeInTheDocument()
  })

  it('affiche la durée en jours quand inférieur à 30 jours', () => {
    const start = new Date('2026-02-01T10:00:00Z').toISOString()
    const end = new Date('2026-02-24T10:00:00Z').toISOString()
    render(<GraduationRecap firstLoginAt={start} graduatedAt={end} />)
    expect(screen.getByText('23 jours')).toBeInTheDocument()
  })

  it('affiche "1 mois" quand la durée est entre 30 et 60 jours', () => {
    const start = new Date('2026-01-01T10:00:00Z').toISOString()
    const end = new Date('2026-02-05T10:00:00Z').toISOString()
    render(<GraduationRecap firstLoginAt={start} graduatedAt={end} />)
    expect(screen.getByText('1 mois')).toBeInTheDocument()
  })

  it('affiche la durée en mois quand supérieur à 30 jours', () => {
    const start = new Date('2025-08-01T10:00:00Z').toISOString()
    const end = new Date('2026-02-24T10:00:00Z').toISOString()
    render(<GraduationRecap firstLoginAt={start} graduatedAt={end} />)
    expect(screen.getByText(/mois/)).toBeInTheDocument()
  })

  it('affiche le label "Durée du parcours"', () => {
    render(<GraduationRecap firstLoginAt={null} graduatedAt="2026-02-24T10:00:00Z" />)
    expect(screen.getByText('Durée du parcours')).toBeInTheDocument()
  })

  it('affiche "Parcours validé"', () => {
    render(<GraduationRecap firstLoginAt={null} graduatedAt="2026-02-24T10:00:00Z" />)
    expect(screen.getByText('Parcours validé')).toBeInTheDocument()
  })

  it('affiche "1 jour" pour une durée de 1 jour', () => {
    const start = new Date('2026-02-23T10:00:00Z').toISOString()
    const end = new Date('2026-02-24T10:00:00Z').toISOString()
    render(<GraduationRecap firstLoginAt={start} graduatedAt={end} />)
    expect(screen.getByText('1 jour')).toBeInTheDocument()
  })

  it("affiche \"Moins d'un jour\" pour une durée inférieure à 1 jour", () => {
    const start = new Date('2026-02-24T09:00:00Z').toISOString()
    const end = new Date('2026-02-24T10:00:00Z').toISOString()
    render(<GraduationRecap firstLoginAt={start} graduatedAt={end} />)
    expect(screen.getByText("Moins d'un jour")).toBeInTheDocument()
  })
})
