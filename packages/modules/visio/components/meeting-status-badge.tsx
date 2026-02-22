import type { MeetingStatus } from '../types/meeting.types'

const STATUS_CONFIG: Record<MeetingStatus, { label: string; className: string }> = {
  scheduled: { label: 'Planifié', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_progress: { label: 'En cours', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Terminé', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  cancelled: { label: 'Annulé', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

interface MeetingStatusBadgeProps {
  status: MeetingStatus
}

export function MeetingStatusBadge({ status }: MeetingStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}
