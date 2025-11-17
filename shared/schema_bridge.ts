// Bridge module: re-export the full introspected schema and provide the
// commonly-used drizzle-zod insert schemas and TS types expected by the
// server code. We import the introspected module (JS extension) so the
// compiler with `moduleResolution: "nodenext"` resolves correctly.

export * from "../drizzle_db_introspect/schema.js";

import * as db from "../drizzle_db_introspect/schema.js";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create and export the popular insert schemas used across the server.
export const insertEscalaoSchema = createInsertSchema(db.escaloes);
export const insertPessoaSchema = createInsertSchema(db.pessoas);
export const insertAtividadeSchema = createInsertSchema(db.atividades);
export const insertPresencaSchema = createInsertSchema(db.presencas);
export const insertMensalidadeSchema = createInsertSchema(db.mensalidades);
export const insertFaturaSchema = createInsertSchema(db.faturas);
export const insertTipoMensalidadeSchema = createInsertSchema(db.tiposMensalidade);
export const insertCentroCustoSchema = createInsertSchema(db.centrosCusto);
export const insertMaterialSchema = createInsertSchema(db.materiais);
export const insertEmprestimoSchema = createInsertSchema(db.emprestimos);
export const insertDadosDesportivosSchema = createInsertSchema(db.dadosDesportivos);
export const insertDadosConfiguracaoSchema = createInsertSchema(db.dadosConfiguracao);
export const insertTreinoSchema = createInsertSchema(db.treinos);
export const insertResultadoSchema = createInsertSchema(db.resultados);

export const insertEmailSchema = createInsertSchema(db.emails);

// Upsert / insert helpers for users
export const upsertUserSchema = createInsertSchema(db.users);

// Export convenient TS types inferred from the tables
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof db.users.$inferSelect;
export type Pessoa = typeof db.pessoas.$inferSelect;
export type Escalao = typeof db.escaloes.$inferSelect;
export type Atividade = typeof db.atividades.$inferSelect;
export type Presenca = typeof db.presencas.$inferSelect;
export type Mensalidade = typeof db.mensalidades.$inferSelect;
export type Material = typeof db.materiais.$inferSelect;
export type Emprestimo = typeof db.emprestimos.$inferSelect;
export type Email = typeof db.emails.$inferSelect;
export type Fatura = typeof db.faturas.$inferSelect;
export type TipoMensalidade = typeof db.tiposMensalidade.$inferSelect;
export type CentroCusto = typeof db.centrosCusto.$inferSelect;
export type DadosDesportivos = typeof db.dadosDesportivos.$inferSelect;
export type DadosConfiguracao = typeof db.dadosConfiguracao.$inferSelect;
export type Treino = typeof db.treinos.$inferSelect;
export type Resultado = typeof db.resultados.$inferSelect;

