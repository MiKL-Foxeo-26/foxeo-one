'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserSupabaseClient } from '@monprojetpro/supabase'

/** Statuts que Supabase renvoie au rappel de `.subscribe()`. */
export type ChatRealtimeStatus = 'connecting' | 'live' | 'degraded'

/** Relecture de secours quand l'abonnement est tombé (ms). */
const FALLBACK_POLL_MS = 20_000

/**
 * Abonnement temps réel du chat.
 *
 * ⚠️ CE HOOK LIT LE STATUT DE SON ABONNEMENT, et ce n'est pas un détail.
 * Jusqu'au 2026-09-09, il appelait `.subscribe()` sans aucun rappel : si la
 * table `messages` sortait de la publication temps réel, ou si une règle RLS
 * empêchait la lecture, le chat se figeait SANS LE MOINDRE SIGNE. Écran
 * parfaitement normal, messages qui n'arrivent plus, personne au courant.
 *
 * Désormais : le statut est remonté à l'appelant (pour l'afficher), et une
 * relecture périodique prend le relais tant que l'abonnement est en panne. Le
 * repli compense la panne, il ne la dissimule pas — les deux vont ensemble.
 */
export function useChatRealtime(clientId: string): ChatRealtimeStatus {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<ChatRealtimeStatus>('connecting')

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['messages', clientId] })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }, [queryClient, clientId])

  // Gardée dans une référence : la relecture de secours ne doit pas se
  // réabonner à chaque rendu.
  const refreshRef = useRef(refresh)
  refreshRef.current = refresh

  useEffect(() => {
    if (!clientId) return

    const supabase = createBrowserSupabaseClient()

    const channel = supabase
      .channel(`chat:room:${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${clientId}`,
        },
        () => refreshRef.current()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${clientId}`,
        },
        () => refreshRef.current()
      )
      .subscribe((channelStatus, err) => {
        if (channelStatus === 'SUBSCRIBED') {
          setStatus('live')
          return
        }
        if (channelStatus === 'CHANNEL_ERROR' || channelStatus === 'TIMED_OUT' || channelStatus === 'CLOSED') {
          setStatus('degraded')
          console.warn(
            `[CHAT:REALTIME] canal "chat:room:${clientId}" en échec (${channelStatus}).\n` +
              `À vérifier dans cet ordre :\n` +
              `  1. la table "messages" appartient bien à la publication supabase_realtime\n` +
              `     → select tablename from pg_publication_tables where pubname='supabase_realtime';\n` +
              `  2. la RLS autorise ce compte à LIRE les messages de ce client\n` +
              `  3. la colonne du filtre (client_id) existe bien sur la table`,
            err,
          )
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientId])

  // Relecture de secours — active UNIQUEMENT quand l'abonnement est tombé.
  // À ne pas confondre avec une relecture périodique laissée par inadvertance :
  // celle-là masquerait justement la panne au lieu de la compenser.
  useEffect(() => {
    if (status !== 'degraded') return
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refreshRef.current()
    }, FALLBACK_POLL_MS)
    return () => clearInterval(timer)
  }, [status])

  return status
}
