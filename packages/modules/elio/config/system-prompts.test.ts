import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from './system-prompts'
import type { CommunicationProfileFR66 } from '../types/elio.types'

const profileDefaut: CommunicationProfileFR66 = {
  levelTechnical: 'intermediaire',
  styleExchange: 'conversationnel',
  adaptedTone: 'pro_decontracte',
  messageLength: 'moyen',
  tutoiement: false,
  concreteExamples: true,
  avoid: [],
  privilege: [],
  styleNotes: '',
}

describe('buildSystemPrompt', () => {
  describe('Dashboard Lab', () => {
    it('contient le contexte Lab dans le prompt', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profileDefaut })
      expect(prompt).toContain('Dashboard Lab')
      expect(prompt).toContain('parcours d\'incubation')
    })

    it('inclut les instructions de profil de communication', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profileDefaut })
      expect(prompt).toContain('Profil de communication')
      expect(prompt).toContain('Niveau technique')
    })

    it('inclut le contexte d\'étape si fourni', () => {
      const prompt = buildSystemPrompt({
        dashboardType: 'lab',
        communicationProfile: profileDefaut,
        activeStepContext: 'Étape 3 : Modèle économique',
      })
      expect(prompt).toContain('Étape 3 : Modèle économique')
    })

    it('ne contient pas de section étape si non fournie', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profileDefaut })
      expect(prompt).not.toContain('Étape active')
    })

    it('inclut tutoiement si activé', () => {
      const profile: CommunicationProfileFR66 = { ...profileDefaut, tutoiement: true }
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profile })
      expect(prompt).toContain('tutoyez le client')
    })

    it('inclut vouvoyement si tutoiement désactivé', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profileDefaut })
      expect(prompt).toContain('vouvoyez le client')
    })
  })

  describe('Dashboard One', () => {
    it('contient le contexte One dans le prompt', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'one', communicationProfile: profileDefaut })
      expect(prompt).toContain('Dashboard One')
      expect(prompt).toContain('outil Foxeo One')
    })

    it('mentionne les capacités One+ pour tier=one_plus', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'one', communicationProfile: profileDefaut, tier: 'one_plus' })
      expect(prompt).toContain('One+')
      expect(prompt).toContain('génération de documents')
    })

    it('mentionne les capacités de base pour tier=one', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'one', communicationProfile: profileDefaut, tier: 'one' })
      expect(prompt).toContain('FAQ')
      expect(prompt).not.toContain('génération de documents')
    })

    it('inclut la documentation des modules si fournie', () => {
      const prompt = buildSystemPrompt({
        dashboardType: 'one',
        communicationProfile: profileDefaut,
        activeModulesDocs: 'Module CRM: gestion des contacts...',
      })
      expect(prompt).toContain('Module CRM: gestion des contacts...')
    })
  })

  describe('Dashboard Hub', () => {
    it('contient le contexte Hub dans le prompt', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'hub' })
      expect(prompt).toContain('Dashboard Hub')
      expect(prompt).toContain('opérateur')
    })

    it('mentionne les capacités Hub', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'hub' })
      expect(prompt).toContain('recherche clients')
    })
  })

  describe('Instructions personnalisées', () => {
    it('ajoute les instructions personnalisées si fournies', () => {
      const prompt = buildSystemPrompt({
        dashboardType: 'lab',
        communicationProfile: profileDefaut,
        customInstructions: 'Toujours répondre en bullet points.',
      })
      expect(prompt).toContain('Instructions personnalisées')
      expect(prompt).toContain('Toujours répondre en bullet points.')
    })

    it('ignore les instructions vides', () => {
      const prompt = buildSystemPrompt({
        dashboardType: 'lab',
        communicationProfile: profileDefaut,
        customInstructions: '   ',
      })
      expect(prompt).not.toContain('Instructions personnalisées')
    })
  })

  describe('Profil par défaut', () => {
    it('fonctionne sans profil de communication (utilise les valeurs par défaut)', () => {
      const prompt = buildSystemPrompt({ dashboardType: 'lab' })
      expect(prompt).toContain('Dashboard Lab')
      expect(prompt).toContain('Profil de communication')
    })
  })

  describe('Éléments du profil', () => {
    it('inclut les items avoid si définis', () => {
      const profile: CommunicationProfileFR66 = { ...profileDefaut, avoid: ['jargon technique'] }
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profile })
      expect(prompt).toContain('jargon technique')
    })

    it('inclut les items privilege si définis', () => {
      const profile: CommunicationProfileFR66 = { ...profileDefaut, privilege: ['listes à puces'] }
      const prompt = buildSystemPrompt({ dashboardType: 'lab', communicationProfile: profile })
      expect(prompt).toContain('listes à puces')
    })
  })
})
