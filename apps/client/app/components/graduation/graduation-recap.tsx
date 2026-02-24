interface GraduationRecapProps {
  firstLoginAt: string | null
  graduatedAt: string
}

function formatDuration(startIso: string | null, endIso: string): string {
  if (!startIso) return 'Parcours complété'

  const start = new Date(startIso)
  const end = new Date(endIso)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (days < 1) return 'Moins d\'un jour'
  if (days === 1) return '1 jour'
  if (days < 30) return `${days} jours`
  const months = Math.floor(days / 30)
  if (months === 1) return '1 mois'
  return `${months} mois`
}

export function GraduationRecap({ firstLoginAt, graduatedAt }: GraduationRecapProps) {
  const duration = formatDuration(firstLoginAt, graduatedAt)

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/10">
      <h3 className="font-semibold text-lg mb-4 text-center">Votre parcours Lab en bref</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-300">{duration}</div>
          <div className="text-sm text-purple-200 mt-1">Durée du parcours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-300">✓</div>
          <div className="text-sm text-purple-200 mt-1">Parcours validé</div>
        </div>
      </div>
    </div>
  )
}
