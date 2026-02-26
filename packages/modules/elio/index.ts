// Élio Module
export { manifest } from './manifest'

// Components
export { PersonalizeElioDialog } from './components/personalize-elio-dialog'
export { ElioGuidedSuggestions } from './components/elio-guided-suggestions'
export { GeneratedBriefDialog } from './components/generated-brief-dialog'
export { ElioGenerateBriefSection } from './components/elio-generate-brief-section'

// Actions
export { createCommunicationProfile } from './actions/create-communication-profile'
export { updateCommunicationProfile } from './actions/update-communication-profile'
export { getCommunicationProfile } from './actions/get-communication-profile'
export { generateBrief } from './actions/generate-brief'
export { submitElioBrief } from './actions/submit-elio-brief'

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
