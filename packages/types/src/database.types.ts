/**
 * Supabase database types — Story 1.2
 *
 * Types manuels alignes sur les migrations SQL (00001-00007).
 * Seront remplaces par `npm run gen:types` quand Supabase local sera disponible.
 *
 * IMPORTANT: Apres chaque migration, regenerer avec:
 *   npx supabase gen types typescript --local > packages/types/src/database.types.ts
 *
 * TODO [Story 1.2]: Verifier que gen:types preserve les unions litterales
 * (ex: 'operator' | 'admin') issues des CHECK constraints SQL.
 * Si gen:types genere `string` a la place, creer des types utilitaires
 * derives dans un fichier separe (ex: database.enums.ts).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      operators: {
        Row: {
          id: string
          email: string
          name: string
          role: 'operator' | 'admin'
          two_factor_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'operator' | 'admin'
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'operator' | 'admin'
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          operator_id: string
          email: string
          name: string
          company: string | null
          contact: string | null
          sector: string | null
          client_type: 'complet' | 'direct_one' | 'ponctuel'
          status: 'active' | 'suspended' | 'archived'
          auth_user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          email: string
          name: string
          company?: string | null
          contact?: string | null
          sector?: string | null
          client_type: 'complet' | 'direct_one' | 'ponctuel'
          status?: 'active' | 'suspended' | 'archived'
          auth_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          email?: string
          name?: string
          company?: string | null
          contact?: string | null
          sector?: string | null
          client_type?: 'complet' | 'direct_one' | 'ponctuel'
          status?: 'active' | 'suspended' | 'archived'
          auth_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clients_operator_id_fkey'
            columns: ['operator_id']
            isOneToOne: false
            referencedRelation: 'operators'
            referencedColumns: ['id']
          },
        ]
      }
      client_configs: {
        Row: {
          client_id: string
          operator_id: string
          active_modules: string[]
          dashboard_type: 'hub' | 'lab' | 'one'
          theme_variant: string | null
          custom_branding: Json
          elio_config: Json
          parcours_config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          operator_id: string
          active_modules?: string[]
          dashboard_type?: 'hub' | 'lab' | 'one'
          theme_variant?: string | null
          custom_branding?: Json
          elio_config?: Json
          parcours_config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          operator_id?: string
          active_modules?: string[]
          dashboard_type?: 'hub' | 'lab' | 'one'
          theme_variant?: string | null
          custom_branding?: Json
          elio_config?: Json
          parcours_config?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'client_configs_client_id_fkey'
            columns: ['client_id']
            isOneToOne: true
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'client_configs_operator_id_fkey'
            columns: ['operator_id']
            isOneToOne: false
            referencedRelation: 'operators'
            referencedColumns: ['id']
          },
        ]
      }
      consents: {
        Row: {
          id: string
          client_id: string
          consent_type: 'cgu' | 'ia_processing'
          accepted: boolean
          version: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          consent_type: 'cgu' | 'ia_processing'
          accepted: boolean
          version: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        /** Table immutable (RGPD) — UPDATE interdit par design. Type present pour compatibilite gen:types. */
        Update: {
          id?: string
          client_id?: string
          consent_type?: 'cgu' | 'ia_processing'
          accepted?: boolean
          version?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'consents_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      activity_logs: {
        Row: {
          id: string
          actor_type: 'client' | 'operator' | 'system' | 'elio'
          actor_id: string
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_type: 'client' | 'operator' | 'system' | 'elio'
          actor_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        /** Table append-only — UPDATE interdit par design. Type present pour compatibilite gen:types. */
        Update: {
          id?: string
          actor_type?: 'client' | 'operator' | 'system' | 'elio'
          actor_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      fn_get_operator_id: {
        Args: Record<string, never>
        Returns: string
      }
      fn_update_updated_at: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
