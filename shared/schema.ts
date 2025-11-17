// Thin re-export: forward `@shared/schema` to the bridge module that
// re-exports the canonical introspected schema and synthesizes the
// drizzle-zod insert schemas the server expects.
// Use explicit .js extension for ESM resolution in node16/nodenext.

export * from "./schema_bridge.js";

// NOTE: legacy/archival schema content was moved to `shared/schema_legacy.ts`.
// This file intentionally re-exports the canonical bridge module only. Keeping
// a single source of truth avoids duplicate declarations and runtime parse
// errors in the browser build (for example, "pgTable is not defined").
