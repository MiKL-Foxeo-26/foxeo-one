// [EMAIL:TEMPLATE] Nouveau message reçu
import { baseTemplate, escapeHtml } from './base'

export interface NewMessageEmailData {
  recipientName: string
  senderName: string
  messagePreview: string
  platformUrl: string
  recipientType: 'client' | 'operator'
}

const MAX_PREVIEW_LENGTH = 200

export function newMessageEmailTemplate(data: NewMessageEmailData): string {
  const preview =
    data.messagePreview.length > MAX_PREVIEW_LENGTH
      ? data.messagePreview.slice(0, MAX_PREVIEW_LENGTH) + '...'
      : data.messagePreview

  const body = `
    <p>Bonjour <strong>${escapeHtml(data.recipientName)}</strong>,</p>
    <p>Vous avez reçu un nouveau message de <strong>${escapeHtml(data.senderName)}</strong>.</p>
    <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #e4e4e7;color:#71717a;font-style:italic;">
      ${escapeHtml(preview)}
    </blockquote>
    <p>Connectez-vous pour répondre.</p>
  `

  return baseTemplate({
    title: `Nouveau message de ${data.senderName}`,
    body,
    ctaUrl: data.platformUrl,
    ctaText: 'Voir le message',
  })
}
