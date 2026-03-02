'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@foxeo/ui'
import { useQuery } from '@tanstack/react-query'
import { OrpheusConfigForm } from './orpheus-config-form'
import { ElioConfigHistory } from './elio-config-history'
import { getElioConfig } from '../actions/get-elio-config'

interface ElioConfigSectionProps {
  clientId: string
}

/**
 * Section Configuration Élio pour la fiche client Hub (AC3 Story 8.3).
 * Combine le formulaire d'édition (Orpheus) et l'historique des modifications.
 */
export function ElioConfigSection({ clientId }: ElioConfigSectionProps) {
  const { data: config, isLoading } = useQuery({
    queryKey: ['elio-config', clientId],
    queryFn: async () => {
      const result = await getElioConfig(clientId)
      if (result.error) return null
      return result.data
    },
  })

  return (
    <Tabs defaultValue="configuration">
      <TabsList>
        <TabsTrigger value="configuration">Configuration</TabsTrigger>
        <TabsTrigger value="historique" data-testid="tab-historique">
          Historique
        </TabsTrigger>
      </TabsList>

      <TabsContent value="configuration" className="mt-4">
        {isLoading ? (
          <div className="h-40 rounded-xl bg-muted animate-pulse" />
        ) : (
          <OrpheusConfigForm initialConfig={config ?? null} />
        )}
      </TabsContent>

      <TabsContent value="historique" className="mt-4">
        <ElioConfigHistory clientId={clientId} />
      </TabsContent>
    </Tabs>
  )
}
