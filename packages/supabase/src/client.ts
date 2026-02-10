import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@foxeo/types'
import { getRequiredEnv } from '@foxeo/utils'

export function createClient() {
  return createBrowserClient<Database>(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
}
