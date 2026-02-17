// Edge Function: send-email
// Story: 3.3 — Notifications email transactionnelles
//
// Déclenchement : appelé par trigger DB ou directement via pg_net
// Input: { notificationId: string }

import { handleSendEmail } from './handler.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const emailFrom = Deno.env.get('EMAIL_FROM') ?? 'Foxeo <noreply@foxeo.io>'

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    console.error('[EMAIL:SEND] Missing required environment variables')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body: { notificationId?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!body.notificationId) {
    return new Response(
      JSON.stringify({ error: 'Missing notificationId' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const result = await handleSendEmail(
    { notificationId: body.notificationId },
    { supabaseUrl, serviceRoleKey, resendApiKey, emailFrom }
  )

  const status = result.success ? 200 : 500
  return new Response(JSON.stringify(result), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
})
