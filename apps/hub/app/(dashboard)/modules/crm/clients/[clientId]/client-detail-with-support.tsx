'use client'

import { ClientDetailContent, type ExtraTab } from '@foxeo/modules/crm'
import { ClientSupportTab } from '@foxeo/modules-support'
import { SubmissionsList } from '@foxeo/module-parcours'
import type { Client } from '@foxeo/modules/crm'
import { useMemo } from 'react'

interface ClientDetailWithSupportProps {
  client: Client
}

export function ClientDetailWithSupport({ client }: ClientDetailWithSupportProps) {
  const extraTabs: ExtraTab[] = useMemo(
    () => [
      {
        value: 'support',
        label: 'Support',
        content: <ClientSupportTab clientId={client.id} />,
      },
      {
        value: 'submissions',
        label: 'Soumissions',
        content: <SubmissionsList clientId={client.id} />,
      },
    ],
    [client.id]
  )

  return <ClientDetailContent client={client} extraTabs={extraTabs} />
}
