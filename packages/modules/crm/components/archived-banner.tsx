'use client'

import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, Button, showSuccess, showError } from '@foxeo/ui'
import { Archive, Play } from 'lucide-react'
import { reactivateClient } from '../actions/reactivate-client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ArchivedBannerProps {
  clientId: string
  archivedAt: string | null
}

export function ArchivedBanner({ clientId, archivedAt }: ArchivedBannerProps) {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const handleReactivate = () => {
    startTransition(async () => {
      const result = await reactivateClient({ clientId })

      if (result.error) {
        showError(result.error.message)
        return
      }

      showSuccess('Client réactivé')
      await queryClient.invalidateQueries({ queryKey: ['clients'] })
      await queryClient.invalidateQueries({ queryKey: ['client', clientId] })
    })
  }

  const formattedDate = archivedAt
    ? format(new Date(archivedAt), 'dd MMMM yyyy', { locale: fr })
    : ''

  return (
    <Alert variant="warning" className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Archive className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Client clôturé</h3>
            <p className="text-sm text-muted-foreground">
              Ce client a été clôturé le {formattedDate}. Les données sont en
              lecture seule.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReactivate}
          disabled={isPending}
        >
          <Play className="h-4 w-4 mr-2" />
          {isPending ? 'Réactivation...' : 'Réactiver'}
        </Button>
      </div>
    </Alert>
  )
}
