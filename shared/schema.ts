import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Auth tables (mandatory for Replit Auth)

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
// IMPORTANT: Keep default config for id column (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users);
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// Swimming Club Management Tables

// Escalões (Age Groups)
export const escaloes = pgTable("escaloes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
});

export const insertEscalaoSchema = createInsertSchema(escaloes);
export type InsertEscalao = z.infer<typeof insertEscalaoSchema>;
export type Escalao = typeof escaloes.$inferSelect;

// Pessoas (People - Athletes, Coaches, Guardians)
export const pessoas = pgTable("pessoas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  nome: varchar("nome", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }),
  telefone: varchar("telefone", { length: 20 }),
  tipo: varchar("tipo", { length: 50 }).notNull(), // atleta/treinador/encarregado
  escalao: integer("escalao").references(() => escaloes.id, { onDelete: 'set null' }),
  dataNascimento: date("data_nascimento"),
  nif: varchar("nif", { length: 20 }),
  morada: text("morada"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPessoaSchema = createInsertSchema(pessoas);
export type InsertPessoa = z.infer<typeof insertPessoaSchema>;
export type Pessoa = typeof pessoas.$inferSelect;

// Atividades (Activities - Training, Competitions, Camps, Meetings)
export const atividades = pgTable("atividades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // treino/prova/estagio/reuniao
  data: date("data").notNull(),
  hora: varchar("hora", { length: 10 }),
  local: varchar("local", { length: 200 }),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAtividadeSchema = createInsertSchema(atividades);
export type InsertAtividade = z.infer<typeof insertAtividadeSchema>;
export type Atividade = typeof atividades.$inferSelect;

// Presenças (Attendance)
export const presencas = pgTable("presencas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  atividadeId: integer("atividade_id").references(() => atividades.id, { onDelete: 'cascade' }).notNull(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  presente: boolean("presente").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPresencaSchema = createInsertSchema(presencas);
export type InsertPresenca = z.infer<typeof insertPresencaSchema>;
export type Presenca = typeof presencas.$inferSelect;

// Mensalidades (Monthly Fees)
export const mensalidades = pgTable("mensalidades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  dataVencimento: date("data_vencimento").notNull(),
  dataPagamento: date("data_pagamento"),
  status: varchar("status", { length: 20 }).notNull(), // pago/pendente/atrasado
  descricao: text("descricao"),
});

export const insertMensalidadeSchema = createInsertSchema(mensalidades);
export type InsertMensalidade = z.infer<typeof insertMensalidadeSchema>;
export type Mensalidade = typeof mensalidades.$inferSelect;

// Materiais (Inventory)
export const materiais = pgTable("materiais", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  quantidade: integer("quantidade").default(0),
  localizacao: varchar("localizacao", { length: 200 }),
  status: varchar("status", { length: 50 }).notNull(), // disponivel/emprestado/manutencao
  stockBaixo: boolean("stock_baixo").default(false),
});

export const insertMaterialSchema = createInsertSchema(materiais);
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materiais.$inferSelect;

// Empréstimos (Loans)
export const emprestimos = pgTable("emprestimos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  materialId: integer("material_id").references(() => materiais.id, { onDelete: 'cascade' }).notNull(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  dataEmprestimo: date("data_emprestimo").notNull(),
  dataDevolucao: date("data_devolucao"),
  devolvido: boolean("devolvido").default(false),
});

export const insertEmprestimoSchema = createInsertSchema(emprestimos);
export type InsertEmprestimo = z.infer<typeof insertEmprestimoSchema>;
export type Emprestimo = typeof emprestimos.$inferSelect;

// Emails (Communications)
export const emails = pgTable("emails", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  assunto: varchar("assunto", { length: 300 }).notNull(),
  mensagem: text("mensagem").notNull(),
  destinatarios: text("destinatarios").notNull(), // JSON array of recipient IDs/emails
  dataEnvio: timestamp("data_envio"),
  enviado: boolean("enviado").default(false),
});

export const insertEmailSchema = createInsertSchema(emails);
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;
