import { describe, it, expect } from 'vitest'
import { toParcours, toParcoursStep } from './parcours-mappers'
import type { ParcoursDB, ParcoursStepDB } from '../types/parcours.types'

const mockParcoursDB: ParcoursDB = {
  id: '00000000-0000-0000-0000-000000000001',
  client_id: '00000000-0000-0000-0000-000000000002',
  template_id: '00000000-0000-0000-0000-000000000003',
  name: 'Mon Parcours Lab',
  description: 'Description du parcours',
  status: 'in_progress',
  completed_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z',
}

const mockStepDB: ParcoursStepDB = {
  id: '00000000-0000-0000-0000-000000000010',
  parcours_id: '00000000-0000-0000-0000-000000000001',
  step_number: 1,
  title: 'Étape 1 — Idée',
  description: 'Définissez votre idée principale.',
  brief_template: 'Mon idée est...',
  brief_content: null,
  brief_assets: null,
  one_teasing_message: null,
  status: 'current',
  completed_at: null,
  validation_required: true,
  validation_id: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}

describe('toParcours', () => {
  it('transforms DB snake_case to camelCase', () => {
    const result = toParcours(mockParcoursDB)
    expect(result.id).toBe(mockParcoursDB.id)
    expect(result.clientId).toBe(mockParcoursDB.client_id)
    expect(result.templateId).toBe(mockParcoursDB.template_id)
    expect(result.name).toBe(mockParcoursDB.name)
    expect(result.description).toBe(mockParcoursDB.description)
    expect(result.status).toBe(mockParcoursDB.status)
    expect(result.completedAt).toBeNull()
    expect(result.createdAt).toBe(mockParcoursDB.created_at)
    expect(result.updatedAt).toBe(mockParcoursDB.updated_at)
  })

  it('preserves null values', () => {
    const dbWithNulls: ParcoursDB = { ...mockParcoursDB, template_id: null, description: null }
    const result = toParcours(dbWithNulls)
    expect(result.templateId).toBeNull()
    expect(result.description).toBeNull()
  })
})

describe('toParcoursStep', () => {
  it('transforms DB snake_case step to camelCase', () => {
    const result = toParcoursStep(mockStepDB)
    expect(result.id).toBe(mockStepDB.id)
    expect(result.parcoursId).toBe(mockStepDB.parcours_id)
    expect(result.stepNumber).toBe(mockStepDB.step_number)
    expect(result.title).toBe(mockStepDB.title)
    expect(result.description).toBe(mockStepDB.description)
    expect(result.briefTemplate).toBe(mockStepDB.brief_template)
    expect(result.status).toBe(mockStepDB.status)
    expect(result.completedAt).toBeNull()
    expect(result.validationRequired).toBe(true)
    expect(result.validationId).toBeNull()
    expect(result.createdAt).toBe(mockStepDB.created_at)
    expect(result.updatedAt).toBe(mockStepDB.updated_at)
  })

  it('handles completed step with completedAt', () => {
    const completedStep: ParcoursStepDB = {
      ...mockStepDB,
      status: 'completed',
      completed_at: '2026-02-01T10:00:00.000Z',
    }
    const result = toParcoursStep(completedStep)
    expect(result.status).toBe('completed')
    expect(result.completedAt).toBe('2026-02-01T10:00:00.000Z')
  })

  it('maps brief_content to briefContent', () => {
    const stepWithBrief: ParcoursStepDB = {
      ...mockStepDB,
      brief_content: '## Mon brief\n\nContenu détaillé de l\'étape.',
    }
    const result = toParcoursStep(stepWithBrief)
    expect(result.briefContent).toBe('## Mon brief\n\nContenu détaillé de l\'étape.')
  })

  it('defaults briefContent to null when absent', () => {
    const result = toParcoursStep(mockStepDB)
    expect(result.briefContent).toBeNull()
  })

  it('maps brief_assets to briefAssets array', () => {
    const stepWithAssets: ParcoursStepDB = {
      ...mockStepDB,
      brief_assets: ['https://example.com/image.jpg', 'https://example.com/video.mp4'],
    }
    const result = toParcoursStep(stepWithAssets)
    expect(result.briefAssets).toEqual(['https://example.com/image.jpg', 'https://example.com/video.mp4'])
  })

  it('defaults briefAssets to empty array when null', () => {
    const result = toParcoursStep(mockStepDB)
    expect(result.briefAssets).toEqual([])
  })

  it('maps one_teasing_message to oneTeasingMessage', () => {
    const stepWithTeasing: ParcoursStepDB = {
      ...mockStepDB,
      one_teasing_message: 'Dans One, cette fonctionnalité sera automatisée.',
    }
    const result = toParcoursStep(stepWithTeasing)
    expect(result.oneTeasingMessage).toBe('Dans One, cette fonctionnalité sera automatisée.')
  })

  it('defaults oneTeasingMessage to null when absent', () => {
    const result = toParcoursStep(mockStepDB)
    expect(result.oneTeasingMessage).toBeNull()
  })
})
