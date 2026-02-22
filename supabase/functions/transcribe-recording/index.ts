// Edge Function: transcribe-recording
// Downloads recording from Storage, sends to Whisper API, stores transcript

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

  let meetingId: string
  try {
    const body = await req.json()
    meetingId = body.meetingId
    if (!meetingId) throw new Error('meetingId requis')
  } catch {
    return jsonResponse({ error: 'meetingId requis' }, 400)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Atomically claim a pending recording by updating status to 'processing'
  // This prevents race conditions if multiple transcription requests arrive
  const { data: recording, error: claimError } = await supabase
    .from('meeting_recordings')
    .update({ transcription_status: 'processing' })
    .eq('meeting_id', meetingId)
    .eq('transcription_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .select('*')
    .single()

  if (claimError || !recording) {
    console.error('[VISIO:TRANSCRIBE] No pending recording to claim for meeting:', meetingId)
    return jsonResponse({ error: 'No pending recording found' }, 404)
  }

  try {
    // Download recording from Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('recordings')
      .download(recording.recording_url)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download recording: ${downloadError?.message ?? 'no data'}`)
    }

    // Call Whisper API
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const formData = new FormData()
    formData.append('file', fileData, 'audio.mp4')
    formData.append('model', 'whisper-1')
    formData.append('language', recording.transcription_language ?? 'fr')
    formData.append('response_format', 'srt')

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
      },
      body: formData,
    })

    if (!whisperRes.ok) {
      const errText = await whisperRes.text()
      throw new Error(`Whisper API error (${whisperRes.status}): ${errText}`)
    }

    const transcriptText = await whisperRes.text()

    // Upload transcript to Storage
    const transcriptFilename = `${recording.id}.srt`
    const { data: transcriptUpload, error: transcriptUploadError } = await supabase.storage
      .from('transcripts')
      .upload(transcriptFilename, new Blob([transcriptText], { type: 'text/plain' }), {
        contentType: 'text/plain',
        upsert: true,
      })

    if (transcriptUploadError || !transcriptUpload) {
      throw new Error(`Transcript upload failed: ${transcriptUploadError?.message ?? 'no data'}`)
    }

    // Update recording with transcript info
    const { error: finalUpdateError } = await supabase
      .from('meeting_recordings')
      .update({
        transcript_url: transcriptUpload.path,
        transcription_status: 'completed',
      })
      .eq('id', recording.id)

    if (finalUpdateError) {
      throw new Error(`Final update failed: ${finalUpdateError.message}`)
    }

    return jsonResponse({ data: { success: true } })
  } catch (err) {
    console.error('[VISIO:TRANSCRIBE] Error:', err)

    // Mark as failed
    await supabase
      .from('meeting_recordings')
      .update({ transcription_status: 'failed' })
      .eq('id', recording.id)

    return jsonResponse({ error: 'Transcription failed' }, 500)
  }
})
