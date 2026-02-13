import { describe, it, expect } from 'vitest'
import { EMPTY_SEARCH, EMPTY_LIST, EMPTY_ERROR } from './empty-state-presets'

describe('EmptyStatePresets', () => {
  it('exports EMPTY_SEARCH preset', () => {
    expect(EMPTY_SEARCH).toBeDefined()
    const preset = EMPTY_SEARCH()
    expect(preset.title).toBe('Aucun résultat trouvé')
  })

  it('exports EMPTY_LIST preset', () => {
    expect(EMPTY_LIST).toBeDefined()
    const preset = EMPTY_LIST()
    expect(preset.title).toBe('Aucun élément')
  })

  it('exports EMPTY_ERROR preset', () => {
    expect(EMPTY_ERROR).toBeDefined()
    const preset = EMPTY_ERROR()
    expect(preset.title).toBe('Impossible de charger le contenu')
  })
})
