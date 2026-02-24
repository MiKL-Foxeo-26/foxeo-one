import type { ParcoursDB, ParcoursStepDB, Parcours, ParcoursStep } from '../types/parcours.types'

export function toParcours(db: ParcoursDB): Parcours {
  return {
    id: db.id,
    clientId: db.client_id,
    templateId: db.template_id,
    name: db.name,
    description: db.description,
    status: db.status,
    completedAt: db.completed_at,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}

export function toParcoursStep(db: ParcoursStepDB): ParcoursStep {
  return {
    id: db.id,
    parcoursId: db.parcours_id,
    stepNumber: db.step_number,
    title: db.title,
    description: db.description,
    briefTemplate: db.brief_template,
    status: db.status,
    completedAt: db.completed_at,
    validationRequired: db.validation_required,
    validationId: db.validation_id,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}
