import { describe, it, expect } from 'vitest'
import { checkIfFeatureExists } from './detect-existing-feature'

const ACTIVE_MODULES_DOC = `
Module SMS : Envoi de SMS groupés à vos contacts. Routes : /modules/sms.
Module Agenda : Calendrier, événements, réservations. Routes : /modules/agenda.
Module Documents : Export de documents en PDF, Word. Routes : /modules/documents.
`

describe('checkIfFeatureExists (Story 8.8 — Task 6)', () => {
  it('Task 6.1 — détecte que le SMS existe dans les modules actifs', () => {
    const result = checkIfFeatureExists('Je voudrais envoyer des SMS', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(true)
    expect(result.instructions).toBeTruthy()
  })

  it('Task 6.1 — détecte que le calendrier existe', () => {
    const result = checkIfFeatureExists('Ajouter un système de réservation', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(true)
    expect(result.instructions).toContain('Agenda')
  })

  it('Task 6.1 — détecte que l\'export existe', () => {
    const result = checkIfFeatureExists('Je voudrais exporter mes données', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(true)
  })

  it('Task 6.2 — retourne des instructions de navigation', () => {
    const result = checkIfFeatureExists('envoyer des SMS', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(true)
    expect(result.instructions).toContain('/modules/sms')
  })

  it('Task 6.3 — retourne exists=false si la fonctionnalité n\'existe pas', () => {
    const result = checkIfFeatureExists('système de ticketing', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(false)
    expect(result.instructions).toBeUndefined()
  })

  it('Task 6.3 — retourne exists=false si pas de documentation modules', () => {
    const result = checkIfFeatureExists('envoyer des SMS', '')
    expect(result.exists).toBe(false)
  })

  it('Task 6.3 — retourne exists=false si documentation null', () => {
    const result = checkIfFeatureExists('envoyer des SMS', null as unknown as string)
    expect(result.exists).toBe(false)
  })

  it('détecte les événements dans le calendrier', () => {
    const result = checkIfFeatureExists('créer un événement', ACTIVE_MODULES_DOC)
    expect(result.exists).toBe(true)
    expect(result.instructions).toContain('/modules/agenda')
  })
})
