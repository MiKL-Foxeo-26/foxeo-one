import { describe, it, expect } from 'vitest'
import { EMPTY_SEARCH, EMPTY_LIST, EMPTY_ERROR } from './empty-state-presets'

describe('EmptyStatePresets', () => {
  it('exports EMPTY_SEARCH preset', () => {
    expect(EMPTY_SEARCH).toBeDefined()
    expect(EMPTY_SEARCH.title).toBe('Aucun résultat trouvé')
  })

  it('exports EMPTY_LIST preset', () => {
    expect(EMPTY_LIST).toBeDefined()
    expect(EMPTY_LIST.title).toBe('Aucun élément')
  })

  it('exports EMPTY_ERROR preset', () => {
    expect(EMPTY_ERROR).toBeDefined()
    expect(EMPTY_ERROR.title).toBe('Impossible de charger le contenu')
  })
})
