// Communication Profile — types canoniques (FR66, FR67, FR68, FR69)
// Story 8.4

export type TechnicalLevel = 'beginner' | 'intermediaire' | 'advanced'
export type ExchangeStyle = 'direct' | 'conversationnel' | 'formel'
export type AdaptedTone = 'formel' | 'pro_decontracte' | 'chaleureux' | 'coach'
export type MessageLength = 'court' | 'moyen' | 'detaille'

export interface CommunicationProfile {
  levelTechnical: TechnicalLevel
  styleExchange: ExchangeStyle
  adaptedTone: AdaptedTone
  messageLength: MessageLength
  tutoiement: boolean
  concreteExamples: boolean
  avoid: string[]
  privilege: string[]
  styleNotes: string
  /** Compilé lors de la graduation Lab → One (Epic 9) */
  lab_learnings?: string[]
}
