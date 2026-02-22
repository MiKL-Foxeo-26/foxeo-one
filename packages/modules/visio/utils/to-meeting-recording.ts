import type { MeetingRecording, MeetingRecordingDB } from '../types/recording.types'

export function toMeetingRecording(db: MeetingRecordingDB): MeetingRecording {
  return {
    id: db.id,
    meetingId: db.meeting_id,
    recordingUrl: db.recording_url,
    recordingDurationSeconds: db.recording_duration_seconds,
    fileSizeBytes: db.file_size_bytes,
    transcriptUrl: db.transcript_url,
    transcriptionStatus: db.transcription_status,
    transcriptionLanguage: db.transcription_language,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}
