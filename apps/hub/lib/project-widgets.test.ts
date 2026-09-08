import { describe, it, expect, vi } from 'vitest'

// Le registre importe la Server Action du module MenuFacile ; en test on ne veut
// que la logique de résolution des préférences, pas un appel au guichet HTTP.
vi.mock('@monprojetpro/module-menu-facile', () => ({
  getMenuFacileHomeWidgets: vi.fn(),
}))

const { isWidgetEnabled, allProjectWidgets, PROJECT_REGISTRY } = await import('./project-widgets')

describe('isWidgetEnabled', () => {
  const widget = { key: 'p.m', label: 'M', defaultEnabled: true }

  it('applique le defaut du registre quand aucune preference n\'est enregistree', () => {
    expect(isWidgetEnabled(widget, {})).toBe(true)
    expect(isWidgetEnabled({ ...widget, defaultEnabled: false }, {})).toBe(false)
  })

  it('laisse la preference enregistree l\'emporter sur le defaut', () => {
    expect(isWidgetEnabled(widget, { 'p.m': false })).toBe(false)
    expect(isWidgetEnabled({ ...widget, defaultEnabled: false }, { 'p.m': true })).toBe(true)
  })

  it('ne confond pas "decoche" et "absent" (false n\'est pas ignore)', () => {
    // Le piege : un `prefs[key] || defaut` ferait revenir une tuile decochee.
    expect(isWidgetEnabled(widget, { 'p.m': false })).not.toBe(widget.defaultEnabled)
  })
})

describe('registre', () => {
  it('expose des cles de mesure uniques', () => {
    const keys = allProjectWidgets().map(({ widget }) => widget.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('prefixe chaque cle de mesure par la cle de son projet', () => {
    for (const project of PROJECT_REGISTRY) {
      for (const widget of project.widgets) {
        expect(widget.key.startsWith(`${project.key}.`)).toBe(true)
      }
    }
  })
})
