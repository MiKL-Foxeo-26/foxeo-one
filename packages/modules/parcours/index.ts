// Parcours Lab Module
export { manifest } from './manifest'

// Components
export { ParcoursOverview } from './components/parcours-overview'
export { ParcoursProgressBar } from './components/parcours-progress-bar'
export { ParcoursStepCard } from './components/parcours-step-card'
export { ParcoursStepDetail } from './components/parcours-step-detail'
export { ParcoursStepStatusBadge } from './components/parcours-step-status-badge'
export { ParcoursTimeline } from './components/parcours-timeline'
export { BriefMarkdownRenderer } from './components/brief-markdown-renderer'
export { BriefAssetsGallery } from './components/brief-assets-gallery'
export { OneTeasingCard } from './components/one-teasing-card'
export { StepNavigationButtons } from './components/step-navigation-buttons'

// Hooks
export { useParcours } from './hooks/use-parcours'
export { useParcoursSteps } from './hooks/use-parcours-steps'

// Actions
export { getParcours } from './actions/get-parcours'
export { updateStepStatus } from './actions/update-step-status'
export { completeStep } from './actions/complete-step'
export { skipStep } from './actions/skip-step'

// Types
export type {
  Parcours,
  ParcoursDB,
  ParcoursStep,
  ParcoursStepDB,
  ParcoursStepStatus,
  ParcoursWithSteps,
  CompleteStepResult,
  GetParcoursInput,
  UpdateStepStatusInput,
  CompleteStepInput,
  SkipStepInput,
} from './types/parcours.types'

export { ParcoursStepStatusValues } from './types/parcours.types'
