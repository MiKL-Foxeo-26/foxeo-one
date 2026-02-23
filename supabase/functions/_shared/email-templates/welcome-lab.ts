// [EMAIL:TEMPLATE] Bienvenue dans Foxeo Lab (destinataire: prospect converti)
import { baseTemplate, escapeHtml } from './base'

export interface WelcomeLabEmailData {
  clientName: string
  parcoursName: string
  activationLink: string
}

export function welcomeLabEmailTemplate(data: WelcomeLabEmailData): string {
  const body = `
    <p>Bonjour <strong>${escapeHtml(data.clientName)}</strong>,</p>
    <p>🎉 Bienvenue dans <strong>Foxeo Lab</strong> !</p>
    <p>Suite à notre échange, votre parcours <strong>${escapeHtml(data.parcoursName)}</strong> est maintenant prêt.</p>
    <p>Pour accéder à votre espace Lab et commencer votre aventure entrepreneuriale, cliquez sur le bouton ci-dessous :</p>
    <p style="color:#6b7280;font-size:14px;">Ce lien d'activation est valable 7 jours.</p>
  `

  return baseTemplate({
    title: 'Bienvenue dans Foxeo Lab !',
    body,
    ctaUrl: data.activationLink,
    ctaText: 'Activer mon espace Lab',
  })
}
