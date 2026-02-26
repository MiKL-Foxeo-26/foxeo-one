// Élio Module
export { manifest } from './manifest'

// Components
export { PersonalizeElioDialog } from './components/personalize-elio-dialog'
export { ElioGuidedSuggestions } from './components/elio-guided-suggestions'
export { GeneratedBriefDialog } from './components/generated-brief-dialog'
export { ElioGenerateBriefSection } from './components/elio-generate-brief-section'
export { OrpheusConfigForm } from './components/orpheus-config-form'
export { ElioModelSelector } from './components/elio-model-selector'
export { ElioTemperatureSlider } from './components/elio-temperature-slider'
export { ElioFeatureToggles } from './components/elio-feature-toggles'

// Actions
export { createCommunicationProfile } from './actions/create-communication-profile'
export { updateCommunicationProfile } from './actions/update-communication-profile'
export { getCommunicationProfile } from './actions/get-communication-profile'
export { generateBrief } from './actions/generate-brief'
export { submitElioBrief } from './actions/submit-elio-brief'
export { getElioConfig } from './actions/get-elio-config'
export { updateElioConfig } from './actions/update-elio-config'
export { resetElioConfig } from './actions/reset-elio-config'

// Utils
export { buildElioSystemPrompt } from './utils/build-system-prompt'
export type { StepContext } from './utils/build-system-prompt'

// Data
export { ELIO_SUGGESTIONS_BY_STEP } from './data/elio-suggestions'

// Types
export type {
  CommunicationProfile,
  CommunicationProfileDB,
  PreferredTone,
  PreferredLength,
  InteractionStyle,
  ContextPreferences,
  CreateCommunicationProfileInput,
  UpdateCommunicationProfileInput,
  GetCommunicationProfileInput,
} from './types/communication-profile.types'

export {
  PreferredToneValues,
  PreferredLengthValues,
  InteractionStyleValues,
  toCommunicationProfile,
} from './types/communication-profile.types'

export type {
  ElioConfig,
  ElioConfigDB,
  ElioModel,
  UpdateElioConfigInput,
} from './types/elio-config.types'

export {
  ELIO_MODELS,
  DEFAULT_ELIO_CONFIG,
  toElioConfig,
} from './types/elio-config.types'
