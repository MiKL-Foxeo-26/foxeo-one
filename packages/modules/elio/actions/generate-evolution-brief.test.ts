import { describe, it, expect } from 'vitest'
import { generateEvolutionBrief } from './generate-evolution-brief'
import type { EvolutionCollectionData } from '../utils/evolution-collection'

describe('generateEvolutionBrief (Story 8.8 — Task 3)', () => {
  const baseData: EvolutionCollectionData = {
    state: 'summary',
    initialRequest: 'Envoi de SMS de rappel',
    clarification: 'Pour rappeler mes clients avant leurs rendez-vous',
    priority: 2,
  }

  it('Task 3.2 — auto-génère un titre à partir du besoin initial', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.title).toBeTruthy()
    expect(brief.title.length).toBeLessThan(80)
  })

  it('Task 3.3 — contient la section Besoin', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.content).toContain('**Besoin**')
  })

  it('Task 3.3 — contient la section Contexte avec la clarification', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.content).toContain('**Contexte**')
    expect(brief.content).toContain('rappeler mes clients')
  })

  it('Task 3.3 — contient la section Priorité', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.content).toContain('**Priorité client**')
    expect(brief.content).toContain('Moyenne')
  })

  it('Task 3.3 — priorité 1 = Basse', () => {
    const data = { ...baseData, priority: 1 as const }
    const brief = generateEvolutionBrief(data)
    expect(brief.content).toContain('Basse')
  })

  it('Task 3.3 — priorité 3 = Haute', () => {
    const data = { ...baseData, priority: 3 as const }
    const brief = generateEvolutionBrief(data)
    expect(brief.content).toContain('Haute')
  })

  it('Task 3.3 — inclut l\'exemple concret si fourni', () => {
    const data = { ...baseData, example: 'Hier j\'ai oublié 3 clients' }
    const brief = generateEvolutionBrief(data)
    expect(brief.content).toContain('**Exemple concret**')
    expect(brief.content).toContain('oublié 3 clients')
  })

  it('Task 3.3 — n\'inclut pas la section exemple si non fourni', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.content).not.toContain('**Exemple concret**')
  })

  it('Task 3.4 — le displayText contient le brief formaté pour affichage', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.displayText).toContain('résumé')
    expect(brief.displayText).toContain('MiKL')
    expect(brief.displayText).toContain(brief.title)
  })

  it('Task 3.4 — le displayText demande validation', () => {
    const brief = generateEvolutionBrief(baseData)
    expect(brief.displayText).toContain('validez')
  })
})
