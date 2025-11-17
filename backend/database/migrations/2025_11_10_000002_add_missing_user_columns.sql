-- Idempotent migration: add missing user columns and reconcile users_id_seq
-- Safe to run multiple times. Intended for dev environment.

BEGIN;

-- Add user-facing columns if they don't exist yet
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS conta_corrente varchar(100),
    ADD COLUMN IF NOT EXISTS email_secundario varchar(255),
    ADD COLUMN IF NOT EXISTS tipo_membro_id integer;

-- Ensure the sequence exists and is owned by users.id, set to max(id)
DO $$
BEGIN
    -- Create the sequence only if it doesn't exist (non-destructive)
    IF NOT EXISTS (SELECT 1 FROM pg_class c WHERE c.relkind = 'S' AND c.relname = 'users_id_seq') THEN
        CREATE SEQUENCE public.users_id_seq;
    END IF;

    -- Set ownership and seed the sequence to max(id)
    PERFORM setval('public.users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM public.users), true);
    EXECUTE 'ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id';
EXCEPTION WHEN OTHERS THEN
    -- Keep migration safe: if something unexpected happens, continue without failing the whole migration.
    RAISE NOTICE 'users sequence reconciliation skipped: %', SQLERRM;
END
$$;

COMMIT;

-- Notes:
-- 1) This migration is intentionally conservative: uses IF NOT EXISTS and wraps sequence operations in a DO block with exception handling.
-- 2) After applying, you can re-run `npx drizzle-kit push` or your normal migration workflow. If Drizzle still attempts to convert SERIAL -> IDENTITY, we should either
--    a) convert the DB columns to IDENTITY in a follow-up migration (higher risk), or
--    b) adjust the Drizzle in-code schema to match the live DB (safer if you prefer to keep serial defaults).
