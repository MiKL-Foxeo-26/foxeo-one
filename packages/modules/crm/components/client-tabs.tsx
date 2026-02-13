'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@foxeo/ui'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ClientInfoTab } from './client-info-tab'
import { ClientTimeline } from './client-timeline'
import { ClientDocumentsTab } from './client-documents-tab'
import { ClientExchangesTab } from './client-exchanges-tab'

interface ClientTabsProps {
  clientId: string
  onEdit?: () => void
}

export function ClientTabs({ clientId, onEdit }: ClientTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || 'informations'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="informations">Informations</TabsTrigger>
        <TabsTrigger value="historique">Historique</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="echanges">Échanges</TabsTrigger>
      </TabsList>

      <TabsContent value="informations">
        <ClientInfoTab clientId={clientId} onEdit={onEdit} />
      </TabsContent>

      <TabsContent value="historique">
        <ClientTimeline clientId={clientId} />
      </TabsContent>

      <TabsContent value="documents">
        <ClientDocumentsTab clientId={clientId} />
      </TabsContent>

      <TabsContent value="echanges">
        <ClientExchangesTab clientId={clientId} />
      </TabsContent>
    </Tabs>
  )
}
