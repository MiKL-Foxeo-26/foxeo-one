/**
 * Auto-generated Supabase types placeholder.
 * Run `supabase gen types typescript --local > packages/types/src/database.types.ts`
 * to generate actual types from your database schema.
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
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
