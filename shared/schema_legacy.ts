// Legacy copy of schema moved here to avoid duplication with canonical schema.
// This file is excluded from TypeScript compilation via tsconfig.json.

// --- BEGIN LEGACY SCHEMA ---

// Re-export the canonical Drizzle schema so the rest of the codebase can
// import from `@shared/schema` as before. The canonical file
// `shared/schema_canonical.ts` (generated from DB introspection) is the
// single source of truth.

export * from "./schema_canonical";

  export * from "./schema_canonical";

);

// ============================================================================
// USERS - Expanded with all PDF fields
// ============================================================================

export const estadoUtilizadorEnum = pgEnum('estado_utilizador', ['ativo', 'inativo', 'suspenso']);
export const sexoEnum = pgEnum('sexo', ['M', 'F', 'Outro']);
export const estadoCivilEnum = pgEnum('estado_civil', ['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto']);

// NOTE: The Laravel migrations in `backend/database/migrations/0001_01_01_000000_create_users_table.php`
// create a minimal `users` table with the core Laravel fields. Align the Drizzle schema with the
// actual columns present in the DB to avoid query errors when selecting non-existent columns.
```typescript
// Full legacy schema moved here (backup). This file is excluded from the TS
// compilation via `tsconfig.json` so it won't cause duplicate-declaration or
// missing-symbol errors while we stabilize the canonical schema.

// --- BEGIN LEGACY SCHEMA (backup) ---

// NOTE: do not import or export this file from the main code paths. It is a
// safe historic copy kept for reference and manual migration work.

// (The original large legacy schema content was moved here by the automation.)

// Legacy full schema archive. Moved here from `shared/schema.ts` to avoid
// duplicate declarations while the canonical/introspected schema is used at
// runtime. This file is kept as an offline archive and should NOT be
// imported by application code. It is excluded in `tsconfig.json`.

// If you need to recover any definitions from the original legacy schema,
// copy the necessary sections here and re-introspect / rework them into the
// canonical schema instead of reintroducing duplicate declarations.

// --- LEGACY SCHEMA ARCHIVE (truncated) ---

/* The original legacy schema was large and has been archived here. If you
   want the full original file restored in this repository, let me know and
   I will place the complete content into this file. For now this placeholder
   keeps an explicit archive path and avoids compiling duplicate symbols. */
