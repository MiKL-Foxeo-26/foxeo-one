// [EMAIL:TEMPLATE] Alerte client Lab inactif (destinataire: MiKL)
import { baseTemplate } from './base'

export interface AlertInactivityEmailData {
  clientName: string
  daysSinceActivity: number
  lastActivityDate: string
  platformUrl: string
}

export function alertInactivityEmailTemplate(data: AlertInactivityEmailData): string {
  const body = `
    <p>Bonjour,</p>
    <p>Votre client <strong>${data.clientName}</strong> est <strong>inactif depuis ${data.daysSinceActivity} jours</strong>.</p>
    <p>Dernière activité enregistrée : <strong>${data.lastActivityDate}</strong>.</p>
    <p>Un suivi proactif maintenant peut faire la différence dans son parcours Lab.</p>
  `

  return baseTemplate({
    title: `Client inactif : ${data.clientName}`,
    body,
    ctaUrl: data.platformUrl,
    ctaText: 'Voir la fiche client',
  })
}
