-- Migration: Add last_synced_at column to documents table
-- Story: 4.5 — Synchronisation documents vers dossier BMAD local
-- Date: 2026-02-20

ALTER TABLE documents
  ADD COLUMN last_synced_at TIMESTAMPTZ NULL DEFAULT NULL;

COMMENT ON COLUMN documents.last_synced_at IS 'Date de la dernière synchronisation manuelle vers le dossier BMAD local (null = jamais synchronisé)';
