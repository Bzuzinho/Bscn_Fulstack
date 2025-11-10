-- Migration: fix users sequence ownership and ensure necessary columns exist
-- Generated: 2025-11-10

BEGIN;

-- Ensure the users_id_seq exists (no-op if it already does)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='users_id_seq') THEN
    CREATE SEQUENCE public.users_id_seq;
  END IF;
END
$$;

-- Make sure the sequence is owned by users.id (idempotent)
ALTER SEQUENCE IF EXISTS public.users_id_seq OWNED BY public.users.id;

-- Seed the sequence to at least the current max(id) in users so nextval() will not collide
SELECT setval('public.users_id_seq', GREATEST((SELECT COALESCE(MAX(id), 1) FROM public.users), 1), true);

-- Add missing user columns if they don't exist (idempotent)
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS conta_corrente varchar(100);

COMMIT;
