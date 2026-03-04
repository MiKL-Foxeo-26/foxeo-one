import { describe, it, expect } from 'vitest'
import {
  getNextQuestion,
  processResponse,
  isCancel,
  type EvolutionCollectionData,
} from './evolution-collection'
import type { CommunicationProfileFR66 } from '../types/elio.types'
import { DEFAULT_COMMUNICATION_PROFILE_FR66 } from '../types/elio.types'

const profileTutoiement: CommunicationProfileFR66 = {
  ...DEFAULT_COMMUNICATION_PROFILE_FR66,
  tutoiement: true,
}

const profileVouvoiement: CommunicationProfileFR66 = {
  ...DEFAULT_COMMUNICATION_PROFILE_FR66,
  tutoiement: false,
}

describe('evolution-collection (Story 8.8 — Task 2)', () => {
  describe('getNextQuestion', () => {
    it('Task 2.2 — state initial → question de clarification (vouvoiement)', () => {
      const q = getNextQuestion('initial', profileVouvoiement)
      expect(q).toContain('vous')
      expect(q).toContain('décrire')
    })

    it('Task 2.3 — state initial → question de clarification (tutoiement)', () => {
      const q = getNextQuestion('initial', profileTutoiement)
      expect(q).toContain('tu')
      expect(q).toContain('décrire')
    })

    it('Task 2.2 — state clarification → question de priorité', () => {
      const q = getNextQuestion('clarification', profileVouvoiement)
      expect(q).toContain('échelle')
      expect(q).toContain('1 à 3')
    })

    it('Task 2.2 — state priority → question exemple concret', () => {
      const q = getNextQuestion('priority', profileVouvoiement)
      expect(q).toContain('exemple concret')
    })

    it('Task 2.4 — state summary → chaîne vide (plus de questions)', () => {
      const q = getNextQuestion('summary', profileVouvoiement)
      expect(q).toBe('')
    })

    it('Task 2.4 — state cancelled → chaîne vide', () => {
      const q = getNextQuestion('cancelled', profileVouvoiement)
      expect(q).toBe('')
    })
  })

  describe('processResponse', () => {
    const baseData: EvolutionCollectionData = {
      state: 'initial',
      initialRequest: 'Envoi de SMS de rappel',
    }

    it('Task 2.2 — initial + réponse → clarification stockée, state=clarification', () => {
      const result = processResponse(baseData, 'Pour rappeler mes clients de leurs RDV')
      expect(result.state).toBe('clarification')
      expect(result.clarification).toBe('Pour rappeler mes clients de leurs RDV')
    })

    it('Task 2.2 — clarification + "2" → priorité stockée, state=priority', () => {
      const data: EvolutionCollectionData = {
        ...baseData,
        state: 'clarification',
        clarification: 'Pour rappeler les clients',
      }
      const result = processResponse(data, '2')
      expect(result.state).toBe('priority')
      expect(result.priority).toBe(2)
    })

    it('Task 2.2 — clarification + "ça me manque souvent" → priorité 2', () => {
      const data: EvolutionCollectionData = {
        ...baseData,
        state: 'clarification',
        clarification: 'Pour rappeler les clients',
      }
      const result = processResponse(data, 'ça me manque souvent')
      expect(result.state).toBe('priority')
      expect(result.priority).toBe(2)
    })

    it('Task 2.2 — priority + réponse → exemple stocké, state=summary', () => {
      const data: EvolutionCollectionData = {
        ...baseData,
        state: 'priority',
        clarification: 'Pour rappeler les clients',
        priority: 2,
      }
      const result = processResponse(data, 'Hier j\'ai oublié de rappeler 3 clients')
      expect(result.state).toBe('summary')
      expect(result.example).toBe('Hier j\'ai oublié de rappeler 3 clients')
    })

    it('Task 2.4 — max 3 questions : summary ne demande plus rien', () => {
      const data: EvolutionCollectionData = {
        state: 'summary',
        initialRequest: 'test',
        clarification: 'test',
        priority: 1,
      }
      const result = processResponse(data, 'oui')
      // summary state doesn't advance further
      expect(result.state).toBe('summary')
    })
  })

  describe('isCancel', () => {
    it('Task 5.1 — détecte "Non laisse tomber"', () => {
      expect(isCancel('Non laisse tomber')).toBe(true)
    })

    it('Task 5.1 — détecte "En fait non"', () => {
      expect(isCancel('En fait non')).toBe(true)
    })

    it('Task 5.1 — détecte "Annuler"', () => {
      expect(isCancel('Annuler')).toBe(true)
    })

    it('Task 5.1 — détecte "laisse tomber" (insensible à la casse)', () => {
      expect(isCancel('LAISSE TOMBER')).toBe(true)
    })

    it('ne détecte pas une réponse normale comme annulation', () => {
      expect(isCancel('Pour rappeler mes clients')).toBe(false)
    })

    it('ne détecte pas "non" seul (trop ambiguë)', () => {
      expect(isCancel('non')).toBe(false)
    })

    it('CR fix MEDIUM-5 — ne détecte pas "oublie pas" comme annulation', () => {
      expect(isCancel('oublie pas que ça bloque mon activité')).toBe(false)
    })

    it('détecte "oublie" seul comme annulation', () => {
      expect(isCancel('oublie')).toBe(true)
    })
  })
})
