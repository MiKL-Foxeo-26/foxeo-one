import Link from 'next/link'
import type { Meeting } from '../types/meeting.types'
import { MeetingStatusBadge } from './meeting-status-badge'

interface MeetingListProps {
  meetings: Meeting[]
  basePath?: string
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}min`
  if (m > 0) return `${m}min ${s}s`
  return `${s}s`
}

export function MeetingList({ meetings, basePath = '/modules/visio' }: MeetingListProps) {
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Aucun meeting trouvé</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-3 pr-4 font-medium text-muted-foreground">Titre</th>
            <th className="pb-3 pr-4 font-medium text-muted-foreground">Date planifiée</th>
            <th className="pb-3 pr-4 font-medium text-muted-foreground">Statut</th>
            <th className="pb-3 pr-4 font-medium text-muted-foreground">Durée</th>
            <th className="pb-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 pr-4 font-medium">{meeting.title}</td>
              <td className="py-3 pr-4 text-muted-foreground">{formatDate(meeting.scheduledAt)}</td>
              <td className="py-3 pr-4">
                <MeetingStatusBadge status={meeting.status} />
              </td>
              <td className="py-3 pr-4 text-muted-foreground">{formatDuration(meeting.durationSeconds)}</td>
              <td className="py-3">
                {meeting.status === 'in_progress' && (
                  <Link
                    href={`${basePath}/${meeting.id}`}
                    aria-label="Rejoindre"
                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Rejoindre
                  </Link>
                )}
                {meeting.status === 'completed' && (
                  <Link
                    href={`${basePath}/${meeting.id}`}
                    className="inline-flex items-center gap-1 rounded-md border border-white/20 px-3 py-1 text-xs font-medium hover:bg-white/10"
                  >
                    Voir détails
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
