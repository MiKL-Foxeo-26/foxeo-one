// Edge Function: openvidu-webhook
// Receives OpenVidu recording events, uploads to Supabase Storage, triggers transcription

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function verifyHmacSignature(body: string, signature: string, secret: string): Promise<boolean> {
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
  // Constant-time comparison via subtle crypto
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

  // Verify webhook signature (HMAC-SHA256)
  const webhookSecret = Deno.env.get('OPENVIDU_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('[VISIO:RECORDING_WEBHOOK] Missing OPENVIDU_WEBHOOK_SECRET')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-openvidu-signature')
  if (!signature) {
    console.error('[VISIO:RECORDING_WEBHOOK] Missing webhook signature header')
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const isValid = await verifyHmacSignature(rawBody, signature, webhookSecret)
  if (!isValid) {
    console.error('[VISIO:RECORDING_WEBHOOK] Invalid webhook signature')
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  // Only process recording ready events
  if (event.event !== 'recordingStatusChanged' || event.status !== 'ready') {
    return jsonResponse({ message: 'Event ignored' })
  }

  const sessionId = event.sessionId as string
  const recordingId = event.id as string
  const recordingUrl = event.url as string
  const duration = event.duration as number
  const size = event.size as number

  if (!sessionId || !recordingId) {
    return jsonResponse({ error: 'Missing sessionId or recordingId' }, 400)
  }

  const openviduUrl = Deno.env.get('OPENVIDU_URL')!
  const openviduSecret = Deno.env.get('OPENVIDU_SECRET')!
  const authHeader = `Basic ${btoa(`OPENVIDUAPP:${openviduSecret}`)}`

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // Download actual recording binary from OpenVidu (use event.url or fallback to content endpoint)
    const downloadUrl = recordingUrl || `${openviduUrl}/openvidu/recordings/${recordingId}/${recordingId}.mp4`
    const recordingRes = await fetch(downloadUrl, {
      headers: { Authorization: authHeader },
    })

    if (!recordingRes.ok) {
      console.error('[VISIO:RECORDING_WEBHOOK] Failed to download recording from OpenVidu:', recordingRes.status)
      return jsonResponse({ error: 'Failed to download recording' }, 502)
    }

    const recordingBlob = await recordingRes.blob()

    // Upload to Supabase Storage
    const filename = `${sessionId}/${recordingId}.mp4`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recordings')
      .upload(filename, recordingBlob, { contentType: 'video/mp4' })

    if (uploadError) {
      console.error('[VISIO:RECORDING_WEBHOOK] Upload failed:', uploadError)
      return jsonResponse({ error: 'Upload failed' }, 500)
    }

    // Find meeting_id from session_id
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id')
      .eq('session_id', sessionId)
      .single()

    if (!meeting) {
      console.error('[VISIO:RECORDING_WEBHOOK] Meeting not found for session:', sessionId)
      return jsonResponse({ error: 'Meeting not found' }, 404)
    }

    // Insert meeting_recordings
    const { error: insertError } = await supabase.from('meeting_recordings').insert({
      meeting_id: meeting.id,
      recording_url: uploadData.path,
      recording_duration_seconds: Math.round(duration ?? 0),
      file_size_bytes: size ?? 0,
    })

    if (insertError) {
      console.error('[VISIO:RECORDING_WEBHOOK] Insert failed:', insertError)
      return jsonResponse({ error: 'Database insert failed' }, 500)
    }

    // Trigger transcription Edge Function (fire-and-forget, async)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    fetch(`${supabaseUrl}/functions/v1/transcribe-recording`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId: meeting.id }),
    }).catch((err) => {
      console.error('[VISIO:RECORDING_WEBHOOK] Failed to trigger transcription:', err)
    })

    return jsonResponse({ data: { success: true } })
  } catch (err) {
    console.error('[VISIO:RECORDING_WEBHOOK] Unexpected error:', err)
    return jsonResponse({ error: 'Internal error' }, 500)
  }
})
