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
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// AUTH & SESSIONS (Mandatory for Replit Auth)
// ============================================================================

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// ============================================================================
// USERS - Expanded with all PDF fields
// ============================================================================

export const estadoUtilizadorEnum = pgEnum('estado_utilizador', ['ativo', 'inativo', 'suspenso']);
export const sexoEnum = pgEnum('sexo', ['M', 'F', 'Outro']);
export const estadoCivilEnum = pgEnum('estado_civil', ['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto']);

export const users = pgTable("users", {
  // Core Replit Auth fields (MANDATORY - DO NOT CHANGE)
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Additional fields from PDF
  numeroSocio: varchar("numero_socio", { length: 50 }),
  name: varchar("name", { length: 200 }), // Full name
  estado: varchar("estado", { length: 50 }), // Status geral
  estadoUtilizador: estadoUtilizadorEnum("estado_utilizador").default('ativo'),
  
  // Personal Information
  nif: varchar("nif", { length: 9 }),
  cartaoCidadao: varchar("cartao_cidadao", { length: 20 }),
  contacto: varchar("contacto", { length: 20 }),
  dataNascimento: date("data_nascimento"),
  sexo: sexoEnum("sexo"),
  
  // Address
  morada: text("morada"),
  codigoPostal: varchar("codigo_postal", { length: 10 }),
  localidade: varchar("localidade", { length: 100 }),
  
  // Additional Info
  empresa: varchar("empresa", { length: 200 }),
  escola: varchar("escola", { length: 200 }),
  estadoCivil: estadoCivilEnum("estado_civil"),
  ocupacao: varchar("ocupacao", { length: 100 }),
  nacionalidade: varchar("nacionalidade", { length: 50 }),
  numeroIrmaos: integer("numero_irmaos"),
  menor: boolean("menor").default(false),
  
  // Relations
  encarregadoId: varchar("encarregado_id").references((): any => users.id, { onDelete: 'set null' }),
  escalaoId: integer("escalao_id").references(() => escaloes.id, { onDelete: 'set null' }),
  tipoMensalidadeId: integer("tipo_mensalidade_id").references(() => tiposMensalidade.id, { onDelete: 'set null' }),
  
  // Auth fields (Laravel legacy - optional with Replit Auth)
  emailVerifiedAt: timestamp("email_verified_at"),
  password: varchar("password", { length: 255 }), // Optional - Replit Auth doesn't use this
  rememberToken: varchar("remember_token", { length: 100 }),
  
  // Role (will be replaced by RBAC)
  role: varchar("role", { length: 50 }).default('membro'),
  
  // Config
  profilePhotoPath: varchar("profile_photo_path", { length: 500 }),
  observacoesConfig: text("observacoes_config"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users);
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================================================
// RBAC SYSTEM
// ============================================================================

export const roles = pgTable("roles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  guardName: varchar("guard_name", { length: 100 }).notNull().default('web'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  guardName: varchar("guard_name", { length: 100 }).notNull().default('web'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roleHasPermissions = pgTable("role_has_permissions", {
  permissionId: integer("permission_id").references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  roleId: integer("role_id").references(() => roles.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: {
    name: "role_has_permissions_pkey",
    columns: [table.permissionId, table.roleId],
  },
}));

export const modelHasRoles = pgTable("model_has_roles", {
  roleId: integer("role_id").references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  modelType: varchar("model_type", { length: 100 }).notNull(), // Polymorphic type
  modelId: varchar("model_id", { length: 100 }).notNull(), // Polymorphic ID
}, (table) => ({
  pk: {
    name: "model_has_roles_pkey",
    columns: [table.roleId, table.modelType, table.modelId],
  },
}));

export const modelHasPermissions = pgTable("model_has_permissions", {
  permissionId: integer("permission_id").references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  modelType: varchar("model_type", { length: 100 }).notNull(),
  modelId: varchar("model_id", { length: 100 }).notNull(),
}, (table) => ({
  pk: {
    name: "model_has_permissions_pkey",
    columns: [table.permissionId, table.modelType, table.modelId],
  },
}));

export const insertRoleSchema = createInsertSchema(roles);
export const insertPermissionSchema = createInsertSchema(permissions);
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;

// ============================================================================
// RGPD - Dados Pessoais & Configuração
// ============================================================================

export const dadosConfiguracao = pgTable("dados_configuracao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  consentimento: boolean("consentimento").default(false),
  dataConsentimento: timestamp("data_consentimento"),
  ficheiroConsentimento: varchar("ficheiro_consentimento", { length: 500 }),
  declaracaoTransporte: boolean("declaracao_transporte").default(false),
  dataTransporte: timestamp("data_transporte"),
  ficheiroTransporte: varchar("ficheiro_transporte", { length: 500 }),
  afiliacao: boolean("afiliacao").default(false),
  dataAfiliacao: timestamp("data_afiliacao"),
  ficheiroAfiliacao: varchar("ficheiro_afiliacao", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDadosConfiguracaoSchema = createInsertSchema(dadosConfiguracao);
export type DadosConfiguracao = typeof dadosConfiguracao.$inferSelect;

// ============================================================================
// ESCALÕES (Age Groups)
// ============================================================================

export const escaloes = pgTable("escaloes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 100 }).notNull().unique(),
  descricao: text("descricao"),
  centroCustoId: integer("centro_custo_id").references(() => centrosCusto.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Historical escalão assignments
export const userEscaloes = pgTable("user_escaloes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  escalaoId: integer("escalao_id").references(() => escaloes.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEscalaoSchema = createInsertSchema(escaloes);
export type Escalao = typeof escaloes.$inferSelect;
export type UserEscalao = typeof userEscaloes.$inferSelect;

// ============================================================================
// ENCARREGADOS DE EDUCAÇÃO
// ============================================================================

export const encarregadoUser = pgTable("encarregado_user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(), // Athlete
  encarregadoId: varchar("encarregado_id").references(() => users.id, { onDelete: 'cascade' }).notNull(), // Guardian
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type EncarregadoUser = typeof encarregadoUser.$inferSelect;

// ============================================================================
// DADOS DESPORTIVOS (Sports & Health Data)
// ============================================================================

export const dadosDesportivos = pgTable("dados_desportivos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  altura: decimal("altura", { precision: 5, scale: 2 }), // cm
  peso: decimal("peso", { precision: 5, scale: 2 }), // kg
  batimento: integer("batimento"), // bpm
  observacoes: text("observacoes"),
  patologias: text("patologias"),
  medicamentos: text("medicamentos"),
  numeroFederacao: varchar("numero_federacao", { length: 50 }),
  pmb: varchar("pmb", { length: 50 }), // Performance/Medical baseline
  dataInscricao: date("data_inscricao"),
  atestadoMedico: boolean("atestado_medico").default(false),
  dataAtestado: date("data_atestado"),
  informacoesMedicas: text("informacoes_medicas"),
  arquivoAmPath: varchar("arquivo_am_path", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDadosDesportivosSchema = createInsertSchema(dadosDesportivos);
export type DadosDesportivos = typeof dadosDesportivos.$inferSelect;

// Legacy table (can be merged with dados_desportivos)
export const saudeAtletas = pgTable("saude_atletas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  patologias: text("patologias"),
  medicamentos: text("medicamentos"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSaudeAtletaSchema = createInsertSchema(saudeAtletas);
export type SaudeAtleta = typeof saudeAtletas.$inferSelect;

// ============================================================================
// TREINOS, PRESENÇAS & RESULTADOS
// ============================================================================

export const treinos = pgTable("treinos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  numero: integer("numero").notNull(),
  data: date("data").notNull(),
  sessao: varchar("sessao", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New structure for presencas (migrated from atividade-based to user-based)
export const presencasNovo = pgTable("presencas_novo", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  data: date("data").notNull(),
  numeroTreino: integer("numero_treino").notNull(),
  presenca: boolean("presenca").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resultados = pgTable("resultados", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  epoca: varchar("epoca", { length: 10 }), // e.g., "2024/25"
  data: date("data").notNull(),
  escalao: varchar("escalao", { length: 100 }),
  competicao: varchar("competicao", { length: 200 }).notNull(),
  local: varchar("local", { length: 200 }),
  piscina: varchar("piscina", { length: 50 }), // e.g., "25m", "50m"
  prova: varchar("prova", { length: 200 }).notNull(),
  tempo: varchar("tempo", { length: 20 }), // Format: "1:23.45"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTreinoSchema = createInsertSchema(treinos);
export const insertPresencaNovoSchema = createInsertSchema(presencasNovo);
export const insertResultadoSchema = createInsertSchema(resultados);
export type Treino = typeof treinos.$inferSelect;
export type PresencaNovo = typeof presencasNovo.$inferSelect;
export type Resultado = typeof resultados.$inferSelect;

// ============================================================================
// EVENTOS & CONVOCATÓRIAS
// ============================================================================

export const visibilidadeEnum = pgEnum('visibilidade', ['privado', 'restrito', 'publico']);

export const eventosTipos = pgTable("eventos_tipos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 100 }).notNull(),
  cor: varchar("cor", { length: 7 }), // Hex color
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const convocatorias = pgTable("convocatorias", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  data: date("data").notNull(),
  ficheiroPath: varchar("ficheiro_path", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventos = pgTable("eventos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descricao: text("descricao"),
  transporte: boolean("transporte").default(false),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  local: varchar("local", { length: 200 }),
  tipoEventoId: integer("tipo_evento_id").references(() => eventosTipos.id, { onDelete: 'set null' }),
  visibilidade: visibilidadeEnum("visibilidade").default('privado'),
  transporteDisponivel: boolean("transporte_disponivel").default(false),
  localPartida: varchar("local_partida", { length: 200 }),
  horaPartida: varchar("hora_partida", { length: 10 }),
  observacoes: text("observacoes"),
  convocatoriaPath: varchar("convocatoria_path", { length: 500 }),
  regulamentoPath: varchar("regulamento_path", { length: 500 }),
  convocatoriaId: integer("convocatoria_id").references(() => convocatorias.id, { onDelete: 'set null' }),
  temTransporte: boolean("tem_transporte").default(false),
  transporteDescricao: text("transporte_descricao"),
  regulamentoId: integer("regulamento_id"), // No FK defined in PDF
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventoEscalao = pgTable("evento_escalao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventoId: integer("evento_id").references(() => eventos.id, { onDelete: 'cascade' }).notNull(),
  escalaoId: integer("escalao_id").references(() => escaloes.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventosUsers = pgTable("eventos_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventoId: integer("evento_id").references(() => eventos.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  convocado: boolean("convocado").default(false),
  presencaConfirmada: boolean("presenca_confirmada").default(false),
  justificacao: text("justificacao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventoTipoSchema = createInsertSchema(eventosTipos);
export const insertConvocatoriaSchema = createInsertSchema(convocatorias);
export const insertEventoSchema = createInsertSchema(eventos);
export type EventoTipo = typeof eventosTipos.$inferSelect;
export type Convocatoria = typeof convocatorias.$inferSelect;
export type Evento = typeof eventos.$inferSelect;

// ============================================================================
// MÓDULO FINANCEIRO
// ============================================================================

// Tipos de Mensalidade (Catalog)
export const tiposMensalidade = pgTable("tipos_mensalidade", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  designacao: varchar("designacao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dados Financeiros por Utilizador
export const dadosFinanceiros = pgTable("dados_financeiros", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  estadoPagamento: varchar("estado_pagamento", { length: 50 }),
  numeroRecibo: varchar("numero_recibo", { length: 100 }),
  referenciaPagamento: varchar("referencia_pagamento", { length: 100 }),
  mensalidadeId: integer("mensalidade_id").references(() => tiposMensalidade.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Faturas (with automatic generation support)
export const estadoFaturaEnum = pgEnum('estado_fatura', ['futuro', 'pendente', 'em_divida', 'paga', 'cancelada']);

export const faturas = pgTable("faturas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  dataFatura: date("data_fatura").notNull(),
  mes: varchar("mes", { length: 7 }).notNull(), // YYYY-MM format
  mesReferencia: varchar("mes_referencia", { length: 7 }), // For billing period
  dataEmissao: date("data_emissao"),
  dataVencimento: date("data_vencimento"),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  estadoPagamento: boolean("estado_pagamento").default(false), // Legacy 0/1
  estado: estadoFaturaEnum("estado").default('pendente'),
  numeroRecibo: varchar("numero_recibo", { length: 100 }),
  referenciaPagamento: varchar("referencia_pagamento", { length: 100 }),
  geradaAutomaticamente: boolean("gerada_automaticamente").default(false),
  epoca: varchar("epoca", { length: 10 }), // e.g., "2024/25"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Itens da Fatura
export const faturaItens = pgTable("fatura_itens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  faturaId: integer("fatura_id").references(() => faturas.id, { onDelete: 'cascade' }).notNull(),
  descricao: varchar("descricao", { length: 300 }).notNull(),
  valorUnitario: decimal("valor_unitario", { precision: 10, scale: 2 }).notNull(),
  quantidade: integer("quantidade").default(1),
  impostoPercentual: decimal("imposto_percentual", { precision: 5, scale: 2 }),
  totalLinha: decimal("total_linha", { precision: 10, scale: 2 }).notNull(),
  dadosFinanceirosId: integer("dados_financeiros_id").references(() => dadosFinanceiros.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Catálogo de Itens Pré-definidos
export const catalogoFaturaItens = pgTable("catalogo_fatura_itens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  descricao: varchar("descricao", { length: 300 }).notNull(),
  valorUnitario: decimal("valor_unitario", { precision: 10, scale: 2 }).notNull(),
  impostoPercentual: decimal("imposto_percentual", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Centros de Custo (Escalões, Departamentos, Clube Genérico)
export const tipoCentroCustoEnum = pgEnum('tipo_centro_custo', ['escalao', 'departamento', 'clube_generico']);

export const centrosCusto = pgTable("centros_custo", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  tipo: tipoCentroCustoEnum("tipo").notNull(),
  referenciaExterna: varchar("referencia_externa", { length: 100 }),
  escalaoId: integer("escalao_id").references(() => escaloes.id, { onDelete: 'set null' }), // For escalao type
  ativo: boolean("ativo").default(true),
  percentagemDistribuicao: decimal("percentagem_distribuicao", { precision: 5, scale: 2 }), // Auto-calculated
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lançamentos Financeiros
export const tipoLancamentoEnum = pgEnum('tipo_lancamento', ['receita', 'despesa']);

export const lancamentosFinanceiros = pgTable("lancamentos_financeiros", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  data: date("data").notNull(),
  descricao: varchar("descricao", { length: 300 }).notNull(),
  tipo: tipoLancamentoEnum("tipo").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
  documentoRef: varchar("documento_ref", { length: 100 }),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  centroCustoId: integer("centro_custo_id").references(() => centrosCusto.id, { onDelete: 'set null' }),
  faturaId: integer("fatura_id").references(() => faturas.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extratos Bancários
export const extratosBancarios = pgTable("extratos_bancarios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  conta: varchar("conta", { length: 100 }).notNull(),
  dataMovimento: date("data_movimento").notNull(),
  descricao: varchar("descricao", { length: 300 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  saldo: decimal("saldo", { precision: 10, scale: 2 }),
  referencia: varchar("referencia", { length: 100 }),
  ficheiroId: integer("ficheiro_id"),
  conciliado: boolean("conciliado").default(false),
  lancamentoId: integer("lancamento_id").references(() => lancamentosFinanceiros.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mapa de Conciliação
export const statusConciliacaoEnum = pgEnum('status_conciliacao', ['sugerido', 'confirmado', 'rejeitado']);

export const mapaConciliacao = pgTable("mapa_conciliacao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  extratoId: integer("extrato_id").references(() => extratosBancarios.id, { onDelete: 'cascade' }).notNull(),
  lancamentoId: integer("lancamento_id").references(() => lancamentosFinanceiros.id, { onDelete: 'cascade' }).notNull(),
  status: statusConciliacaoEnum("status").default('sugerido'),
  regraUsada: varchar("regra_usada", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTipoMensalidadeSchema = createInsertSchema(tiposMensalidade);
export const insertFaturaSchema = createInsertSchema(faturas);
export const insertCentroCustoSchema = createInsertSchema(centrosCusto);
export const insertLancamentoFinanceiroSchema = createInsertSchema(lancamentosFinanceiros);
export type TipoMensalidade = typeof tiposMensalidade.$inferSelect;
export type Fatura = typeof faturas.$inferSelect;
export type CentroCusto = typeof centrosCusto.$inferSelect;
export type LancamentoFinanceiro = typeof lancamentosFinanceiros.$inferSelect;

// ============================================================================
// MÓDULO PATROCÍNIOS
// ============================================================================

export const tipoPatrocinioEnum = pgEnum('tipo_patrocinio', ['anual', 'pontual']);
export const estadoPatrocinioEnum = pgEnum('estado_patrocinio', ['ativo', 'suspenso', 'terminado']);

export const patrocinadores = pgTable("patrocinadores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  nif: varchar("nif", { length: 9 }),
  email: varchar("email", { length: 200 }),
  telefone: varchar("telefone", { length: 20 }),
  morada: text("morada"),
  site: varchar("site", { length: 300 }),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patrocinios = pgTable("patrocinios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  patrocinadorId: integer("patrocinador_id").references(() => patrocinadores.id, { onDelete: 'cascade' }).notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  tipo: tipoPatrocinioEnum("tipo").notNull(),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  contrapartidas: text("contrapartidas"),
  estado: estadoPatrocinioEnum("estado").default('ativo'),
  contratoPath: varchar("contrato_path", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patrocinioParcelas = pgTable("patrocinio_parcelas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  patrocinioId: integer("patrocinio_id").references(() => patrocinios.id, { onDelete: 'cascade' }).notNull(),
  dataVencimento: date("data_vencimento").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  pago: boolean("pago").default(false),
  dataPagamento: date("data_pagamento"),
  referenciaPagamento: varchar("referencia_pagamento", { length: 100 }),
  faturaId: integer("fatura_id").references(() => faturas.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patrocinioMetricas = pgTable("patrocinio_metricas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  patrocinioId: integer("patrocinio_id").references(() => patrocinios.id, { onDelete: 'cascade' }).notNull(),
  impressoes: integer("impressoes"),
  cliques: integer("cliques"),
  exposicoesEventos: integer("exposicoes_eventos"),
  mencoesSocial: integer("mencoes_social"),
  observacoes: text("observacoes"),
  periodo: varchar("periodo", { length: 7 }), // YYYY-MM
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPatrocinadorSchema = createInsertSchema(patrocinadores);
export const insertPatrocinioSchema = createInsertSchema(patrocinios);
export type Patrocinador = typeof patrocinadores.$inferSelect;
export type Patrocinio = typeof patrocinios.$inferSelect;

// ============================================================================
// MÓDULO VENDAS & STOCKS (Merchandising)
// ============================================================================

export const tipoMovimentoStockEnum = pgEnum('tipo_movimento_stock', ['entrada', 'saida', 'ajuste']);

export const produtos = pgTable("produtos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sku: varchar("sku", { length: 100 }).unique(),
  nome: varchar("nome", { length: 200 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  taxaIva: decimal("taxa_iva", { precision: 5, scale: 2 }),
  ativo: boolean("ativo").default(true),
  stockAtual: integer("stock_atual").default(0),
  stockMinimo: integer("stock_minimo").default(0),
  imagens: jsonb("imagens"), // JSON array of image URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const movimentosStock = pgTable("movimentos_stock", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  produtoId: integer("produto_id").references(() => produtos.id, { onDelete: 'cascade' }).notNull(),
  tipo: tipoMovimentoStockEnum("tipo").notNull(),
  quantidade: integer("quantidade").notNull(),
  motivo: varchar("motivo", { length: 300 }),
  documentoRef: varchar("documento_ref", { length: 100 }),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vendas = pgTable("vendas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  data: date("data").notNull(),
  clienteNome: varchar("cliente_nome", { length: 200 }),
  clienteNif: varchar("cliente_nif", { length: 9 }),
  totalBruto: decimal("total_bruto", { precision: 10, scale: 2 }).notNull(),
  totalIva: decimal("total_iva", { precision: 10, scale: 2 }).notNull(),
  totalLiquido: decimal("total_liquido", { precision: 10, scale: 2 }).notNull(),
  metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
  faturaId: integer("fatura_id").references(() => faturas.id, { onDelete: 'set null' }),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }), // Vendedor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vendaItens = pgTable("venda_itens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  vendaId: integer("venda_id").references(() => vendas.id, { onDelete: 'cascade' }).notNull(),
  produtoId: integer("produto_id").references(() => produtos.id, { onDelete: 'set null' }),
  descricao: varchar("descricao", { length: 300 }).notNull(),
  quantidade: integer("quantidade").default(1),
  precoUnitario: decimal("preco_unitario", { precision: 10, scale: 2 }).notNull(),
  taxaIva: decimal("taxa_iva", { precision: 5, scale: 2 }),
  totalLinha: decimal("total_linha", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProdutoSchema = createInsertSchema(produtos);
export const insertVendaSchema = createInsertSchema(vendas);
export type Produto = typeof produtos.$inferSelect;
export type Venda = typeof vendas.$inferSelect;

// ============================================================================
// MÓDULO MARKETING/COMUNICAÇÃO
// ============================================================================

export const estadoNoticiaEnum = pgEnum('estado_noticia', ['rascunho', 'publicado']);
export const canalCampanhaEnum = pgEnum('canal_campanha', ['email', 'social', 'site']);
export const tipoInteracaoEnum = pgEnum('tipo_interacao', ['email', 'telefone', 'reuniao', 'outro']);

export const noticias = pgTable("noticias", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: varchar("titulo", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  resumo: text("resumo"),
  corpoHtml: text("corpo_html").notNull(),
  imagemCapa: varchar("imagem_capa", { length: 500 }),
  destaque: boolean("destaque").default(false),
  publicadoEm: timestamp("publicado_em"),
  autorId: varchar("autor_id").references(() => users.id, { onDelete: 'set null' }),
  estado: estadoNoticiaEnum("estado").default('rascunho'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campanhas = pgTable("campanhas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  objetivo: text("objetivo"),
  publicoAlvo: text("publico_alvo"),
  canal: canalCampanhaEnum("canal").notNull(),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  estado: varchar("estado", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campanhaLogs = pgTable("campanha_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  campanhaId: integer("campanha_id").references(() => campanhas.id, { onDelete: 'cascade' }).notNull(),
  data: date("data").notNull(),
  canal: varchar("canal", { length: 50 }),
  mensagem: text("mensagem"),
  alcance: integer("alcance"),
  cliques: integer("cliques"),
  conversoes: integer("conversoes"),
  custo: decimal("custo", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmInteracoes = pgTable("crm_interacoes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  tipo: tipoInteracaoEnum("tipo").notNull(),
  assunto: varchar("assunto", { length: 300 }),
  descricao: text("descricao"),
  proximoPassoData: date("proximo_passo_data"),
  resultado: text("resultado"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNoticiaSchema = createInsertSchema(noticias);
export const insertCampanhaSchema = createInsertSchema(campanhas);
export type Noticia = typeof noticias.$inferSelect;
export type Campanha = typeof campanhas.$inferSelect;

// ============================================================================
// LEGACY TABLES (will be deprecated after migration)
// ============================================================================

// Pessoas (People - TO BE MIGRATED TO users)
export const pessoas = pgTable("pessoas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  nome: varchar("nome", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }),
  telefone: varchar("telefone", { length: 20 }),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  escalao: integer("escalao").references(() => escaloes.id, { onDelete: 'set null' }),
  dataNascimento: date("data_nascimento"),
  nif: varchar("nif", { length: 20 }),
  morada: text("morada"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Atividades (TO BE REPLACED BY eventos)
export const atividades = pgTable("atividades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  data: date("data").notNull(),
  hora: varchar("hora", { length: 10 }),
  local: varchar("local", { length: 200 }),
  descricao: text("descricao"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Old Presenças structure (TO BE MIGRATED TO presencas_novo)
export const presencas = pgTable("presencas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  atividadeId: integer("atividade_id").references(() => atividades.id, { onDelete: 'cascade' }).notNull(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  presente: boolean("presente").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Old Mensalidades (TO BE REPLACED BY faturas)
export const mensalidades = pgTable("mensalidades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  dataVencimento: date("data_vencimento").notNull(),
  dataPagamento: date("data_pagamento"),
  status: varchar("status", { length: 20 }).notNull(),
  descricao: text("descricao"),
});

// Old Materiais & Empréstimos (can be kept or migrated to produtos)
export const materiais = pgTable("materiais", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  quantidade: integer("quantidade").default(0),
  localizacao: varchar("localizacao", { length: 200 }),
  status: varchar("status", { length: 50 }).notNull(),
  stockBaixo: boolean("stock_baixo").default(false),
});

export const emprestimos = pgTable("emprestimos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  materialId: integer("material_id").references(() => materiais.id, { onDelete: 'cascade' }).notNull(),
  pessoaId: integer("pessoa_id").references(() => pessoas.id, { onDelete: 'cascade' }).notNull(),
  dataEmprestimo: date("data_emprestimo").notNull(),
  dataDevolucao: date("data_devolucao"),
  devolvido: boolean("devolvido").default(false),
});

// Old Emails table (can be integrated with campanhas)
export const emails = pgTable("emails", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  assunto: varchar("assunto", { length: 300 }).notNull(),
  mensagem: text("mensagem").notNull(),
  destinatarios: text("destinatarios").notNull(),
  dataEnvio: timestamp("data_envio"),
  enviado: boolean("enviado").default(false),
});

export const insertPessoaSchema = createInsertSchema(pessoas);
export const insertAtividadeSchema = createInsertSchema(atividades);
export const insertPresencaSchema = createInsertSchema(presencas);
export const insertMensalidadeSchema = createInsertSchema(mensalidades);
export const insertMaterialSchema = createInsertSchema(materiais);
export const insertEmprestimoSchema = createInsertSchema(emprestimos);
export const insertEmailSchema = createInsertSchema(emails);
export type Pessoa = typeof pessoas.$inferSelect;
export type Atividade = typeof atividades.$inferSelect;
export type Presenca = typeof presencas.$inferSelect;
export type Mensalidade = typeof mensalidades.$inferSelect;
export type Material = typeof materiais.$inferSelect;
export type Emprestimo = typeof emprestimos.$inferSelect;
export type Email = typeof emails.$inferSelect;
