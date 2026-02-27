'use client'

import { ValidationQueue } from '@foxeo/modules-validation-hub'
import { usePresenceContext } from '@foxeo/modules-chat'

export default function ValidationHubPage() {
  const { operatorId } = usePresenceContext()
  return <ValidationQueue operatorId={operatorId} />
}
