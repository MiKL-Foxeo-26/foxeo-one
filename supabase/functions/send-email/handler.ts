// [EMAIL:HANDLER] Logique métier de l'Edge Function send-email
// Séparé de l'entry point Deno pour testabilité Vitest

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createEmailClient } from '../_shared/email-client.ts'
import { validationEmailTemplate } from '../_shared/email-templates/validation.ts'
import { newMessageEmailTemplate } from '../_shared/email-templates/new-message.ts'
import { alertInactivityEmailTemplate } from '../_shared/email-templates/alert-inactivity.ts'
import { graduationEmailTemplate } from '../_shared/email-templates/graduation.ts'
import { paymentFailedEmailTemplate } from '../_shared/email-templates/payment-failed.ts'

export interface SendEmailInput {
  notificationId: string
}

export interface SendEmailConfig {
  supabaseUrl: string
  serviceRoleKey: string
  resendApiKey: string
  emailFrom: string
}

export interface SendEmailResult {
  success: boolean
  skipped?: boolean
  emailFailed?: boolean
  error?: string
}

interface NotificationRow {
  id: string
  recipient_type: 'client' | 'operator'
  recipient_id: string
  type: string
  title: string
  body: string | null
  link: string | null
}

interface RecipientRow {
  email: string
  name: string
  email_notifications_enabled: boolean
}

function buildPlatformUrl(notification: NotificationRow): string {
  const base = notification.recipient_type === 'operator'
    ? 'https://hub.foxeo.io'
    : 'https://lab.foxeo.io'
  return notification.link ? `${base}${notification.link}` : base
}

function renderTemplate(notification: NotificationRow, recipient: RecipientRow): { subject: string; html: string } {
  const platformUrl = buildPlatformUrl(notification)

  switch (notification.type) {
    case 'validation':
      return {
        subject: `Votre brief a été traité — Foxeo`,
        html: validationEmailTemplate({
          clientName: recipient.name,
          briefTitle: notification.title,
          outcome: notification.body?.includes('refusé') ? 'refused' : 'validated',
          comment: notification.body ?? undefined,
          platformUrl,
        }),
      }

    case 'message': {
      // Extraire le nom de l'expéditeur depuis le titre (format: "Nouveau message de {sender}")
      const senderMatch = notification.title.match(/(?:Nouveau message de |New message from )(.+)/)
      const senderName = senderMatch?.[1] ?? (notification.recipient_type === 'client' ? 'votre accompagnateur' : 'votre client')
      return {
        subject: notification.title,
        html: newMessageEmailTemplate({
          recipientName: recipient.name,
          senderName,
          messagePreview: notification.body ?? '',
          platformUrl,
          recipientType: notification.recipient_type,
        }),
      }
    }

    case 'inactivity_alert':
    case 'alert': {
      const clientNameMatch = notification.title.match(/Client inactif\s*:\s*(.+)/)
      // Extraire le nombre de jours depuis le body (format: "inactif depuis X jours")
      const daysMatch = notification.body?.match(/inactif depuis (\d+) jours/)
      // Extraire la date depuis le body (format: "Dernière activité : DD/MM/YYYY")
      const dateMatch = notification.body?.match(/Derni[eè]re activit[ée]\s*:\s*(\S+)/)
      return {
        subject: notification.title,
        html: alertInactivityEmailTemplate({
          clientName: clientNameMatch?.[1] ?? 'Votre client',
          daysSinceActivity: daysMatch ? parseInt(daysMatch[1], 10) : 0,
          lastActivityDate: dateMatch?.[1] ?? new Date().toLocaleDateString('fr-FR'),
          platformUrl,
        }),
      }
    }

    case 'graduation':
      return {
        subject: 'Félicitations ! Votre espace One est prêt — Foxeo',
        html: graduationEmailTemplate({
          clientName: recipient.name,
          oneUrl: platformUrl,
        }),
      }

    case 'payment': {
      // Extraire le montant depuis le body (format: "X,XX EUR" ou "X.XX EUR")
      const amountMatch = notification.body?.match(/([\d.,]+)\s*(EUR|€)/)
      return {
        subject: 'Échec de paiement — Foxeo',
        html: paymentFailedEmailTemplate({
          recipientName: recipient.name,
          amount: amountMatch?.[1] ?? '—',
          currency: amountMatch?.[2] ?? 'EUR',
          platformUrl,
          recipientType: notification.recipient_type,
        }),
      }
    }

    default:
      return {
        subject: notification.title,
        html: `<p>${notification.body ?? notification.title}</p>`,
      }
  }
}

// Task 5.2 — Alerte MiKL si > 5 échecs email en 1h
const EMAIL_FAILURE_THRESHOLD = 5
const EMAIL_FAILURE_WINDOW_MS = 60 * 60 * 1000 // 1 heure

async function checkEmailFailureThreshold(
  supabase: ReturnType<typeof createClient>,
  recipientId: string
): Promise<void> {
  try {
    const oneHourAgo = new Date(Date.now() - EMAIL_FAILURE_WINDOW_MS).toISOString()
    const { count, error } = await supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'email_failed')
      .gte('created_at', oneHourAgo)

    if (error || count === null) return
    if (count <= EMAIL_FAILURE_THRESHOLD) return

    // Alerter tous les opérateurs (admins)
    const { data: operators } = await supabase
      .from('operators')
      .select('auth_user_id')
      .eq('role', 'admin')

    if (!operators?.length) return

    for (const op of operators) {
      if (!op.auth_user_id) continue
      await supabase.from('notifications').insert({
        recipient_type: 'operator',
        recipient_id: op.auth_user_id,
        type: 'alert',
        title: `Alerte email : ${count} échecs en 1h`,
        body: `Le service email a enregistré ${count} échecs d'envoi dans la dernière heure. Vérifiez la configuration Resend.`,
        link: null,
      })
    }

    console.warn(`[EMAIL:MONITOR] Alert triggered: ${count} failures in last hour`)
  } catch (err) {
    // Le monitoring ne doit pas bloquer le flux principal
    console.error('[EMAIL:MONITOR] Failed to check failure threshold:', err)
  }
}

export async function handleSendEmail(
  input: SendEmailInput,
  config: SendEmailConfig
): Promise<SendEmailResult> {
  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey)
  const emailClient = createEmailClient({ apiKey: config.resendApiKey, from: config.emailFrom })

  // 1. Fetch notification
  const { data: notification, error: notifError } = await supabase
    .from('notifications')
    .select('id, recipient_type, recipient_id, type, title, body, link')
    .eq('id', input.notificationId)
    .single()

  if (notifError || !notification) {
    console.error('[EMAIL:SEND] Notification not found:', input.notificationId, notifError)
    return { success: false, error: `Notification not found: ${notifError?.message}` }
  }

  const notif = notification as NotificationRow

  // 2. Fetch recipient and check email preferences
  // recipient_id = auth.uid() (via RLS), donc on cherche par auth_user_id
  const recipientTable = notif.recipient_type === 'client' ? 'clients' : 'operators'
  const { data: recipient, error: recipientError } = await supabase
    .from(recipientTable)
    .select('email, name, email_notifications_enabled')
    .eq('auth_user_id', notif.recipient_id)
    .single()

  if (recipientError || !recipient) {
    console.error('[EMAIL:SEND] Recipient not found:', notif.recipient_id, recipientError)
    return { success: false, error: `Recipient not found: ${recipientError?.message}` }
  }

  const recip = recipient as RecipientRow

  // 3. Check preferences (default: true)
  const emailEnabled = recip.email_notifications_enabled !== false
  if (!emailEnabled) {
    console.log(`[EMAIL:SEND] Skipped — email notifications disabled for recipient ${notif.recipient_id}`)
    return { success: true, skipped: true }
  }

  // 4. Build and send email
  try {
    const { subject, html } = renderTemplate(notif, recip)
    await emailClient.sendWithRetry({ to: recip.email, subject, html })

    // 5. Log success
    await supabase.from('activity_logs').insert({
      actor_type: 'system',
      actor_id: notif.recipient_id,
      action: 'email_sent',
      entity_type: 'notification',
      entity_id: notif.id,
      metadata: { type: notif.type, recipient: recip.email },
    })

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[EMAIL:FAILED] Failed to send email for notification ${notif.id}:`, errorMessage)

    // Log failure in activity_logs (mode dégradé — in-app reste fonctionnel)
    await supabase.from('activity_logs').insert({
      actor_type: 'system',
      actor_id: notif.recipient_id,
      action: 'email_failed',
      entity_type: 'notification',
      entity_id: notif.id,
      metadata: { type: notif.type, recipient: recip.email, error: errorMessage },
    })

    // Task 5.2 — Monitoring : alerte MiKL si > 5 échecs en 1h
    await checkEmailFailureThreshold(supabase, notif.recipient_id)

    return { success: false, emailFailed: true, error: errorMessage }
  }
}
