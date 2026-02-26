// Story 7.2 — Vue détaillée d'une demande (à implémenter)
export default function ValidationRequestDetailPage({
  params,
}: {
  params: { requestId: string }
}) {
  return (
    <div className="p-6">
      <p className="text-muted-foreground text-sm">
        Détail de la demande {params.requestId} — Story 7.2
      </p>
    </div>
  )
}
