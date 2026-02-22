'use client'

interface CalcomBookingWidgetProps {
  calcomUrl: string
  clientId: string
  operatorId: string
}

export function CalcomBookingWidget({ calcomUrl, clientId, operatorId }: CalcomBookingWidgetProps) {
  const iframeSrc = `${calcomUrl}?metadata[clientId]=${encodeURIComponent(clientId)}&metadata[operatorId]=${encodeURIComponent(operatorId)}`

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <iframe
        src={iframeSrc}
        title="Prendre rendez-vous avec MiKL"
        className="w-full min-h-[600px] border-0"
        loading="lazy"
      />
    </div>
  )
}
