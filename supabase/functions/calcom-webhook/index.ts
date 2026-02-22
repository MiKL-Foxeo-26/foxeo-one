// Edge Function: calcom-webhook
// Receives Cal.com BOOKING_CREATED events, creates meeting + meeting_request

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function verifyCalcomSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return computed === signature.toLowerCase()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const webhookSecret = Deno.env.get('CALCOM_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('[VISIO:CALCOM_WEBHOOK] Missing CALCOM_WEBHOOK_SECRET')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256')
  if (!signature) {
    console.error('[VISIO:CALCOM_WEBHOOK] Missing webhook signature header')
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const isValid = await verifyCalcomSignature(rawBody, signature, webhookSecret)
  if (!isValid) {
    console.error('[VISIO:CALCOM_WEBHOOK] Invalid webhook signature')
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  if (event.triggerEvent !== 'BOOKING_CREATED') {
    return jsonResponse({ message: 'Event ignored' })
  }

  const payload = event.payload as Record<string, unknown> | undefined
  if (!payload) {
    return jsonResponse({ error: 'Missing payload' }, 400)
  }

  const startTime = payload.startTime as string | undefined
  const title = (payload.title as string) || 'Consultation avec MiKL'
  const metadata = payload.metadata as Record<string, unknown> | undefined

  const clientId = metadata?.clientId as string | undefined
  const operatorId = metadata?.operatorId as string | undefined

  if (!clientId || !operatorId) {
    console.error('[VISIO:CALCOM_WEBHOOK] Missing clientId or operatorId in metadata')
    return jsonResponse({ error: 'Missing metadata' }, 400)
  }

  if (!startTime) {
    console.error('[VISIO:CALCOM_WEBHOOK] Missing startTime')
    return jsonResponse({ error: 'Missing startTime' }, 400)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        client_id: clientId,
        operator_id: operatorId,
        title,
        scheduled_at: startTime,
        status: 'scheduled',
      })
      .select()
      .single()

    if (meetingError || !meeting) {
      console.error('[VISIO:CALCOM_WEBHOOK] Failed to create meeting:', meetingError)
      return jsonResponse({ error: 'Failed to create meeting' }, 500)
    }

    // Create meeting_request (auto-accepted via Cal.com)
    const { error: requestError } = await supabase.from('meeting_requests').insert({
      client_id: clientId,
      operator_id: operatorId,
      requested_slots: [startTime],
      selected_slot: startTime,
      status: 'accepted',
      meeting_id: meeting.id,
      message: 'Réservation via Cal.com',
    })

    if (requestError) {
      console.error('[VISIO:CALCOM_WEBHOOK] Failed to create meeting_request:', requestError)
      // Non-blocking — meeting was already created
    }

    // Resolve client auth_user_id for notification
    const { data: clientRecord } = await supabase
      .from('clients')
      .select('auth_user_id')
      .eq('id', clientId)
      .single()

    // Notification client (best-effort)
    if (clientRecord?.auth_user_id) {
      await supabase.from('notifications').insert({
        recipient_id: clientRecord.auth_user_id,
        type: 'meeting_scheduled',
        title: 'RDV confirmé',
        message: `Votre rendez-vous avec MiKL est prévu le ${new Date(startTime).toLocaleString('fr-FR')}`,
        metadata: { meetingId: meeting.id, link: `/modules/visio/${meeting.id}/lobby` },
      }).catch((err: unknown) => {
        console.error('[VISIO:CALCOM_WEBHOOK] Notification error (non-blocking):', err)
      })
    }

    return jsonResponse({ data: { success: true, meetingId: meeting.id } })
  } catch (err) {
    console.error('[VISIO:CALCOM_WEBHOOK] Unexpected error:', err)
    return jsonResponse({ error: 'Internal error' }, 500)
  }
})
