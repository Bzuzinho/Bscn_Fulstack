import { pgTable, unique, serial, varchar, timestamp, date, text, integer, boolean, bigint, index, jsonb, numeric, bigserial, smallint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const canalCampanha = pgEnum("canal_campanha", ['email', 'social', 'site'])
export const estadoCivil = pgEnum("estado_civil", ['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto'])
export const estadoFatura = pgEnum("estado_fatura", ['futuro', 'pendente', 'em_divida', 'paga', 'cancelada'])
export const estadoNoticia = pgEnum("estado_noticia", ['rascunho', 'publicado'])
export const estadoPatrocinio = pgEnum("estado_patrocinio", ['ativo', 'suspenso', 'terminado'])
export const estadoUtilizador = pgEnum("estado_utilizador", ['ativo', 'inativo', 'suspenso'])
export const sexo = pgEnum("sexo", ['M', 'F', 'Outro'])
export const statusConciliacao = pgEnum("status_conciliacao", ['sugerido', 'confirmado', 'rejeitado'])
export const tipoCentroCusto = pgEnum("tipo_centro_custo", ['escalao', 'departamento', 'clube_generico'])
export const tipoInteracao = pgEnum("tipo_interacao", ['email', 'telefone', 'reuniao', 'outro'])
export const tipoLancamento = pgEnum("tipo_lancamento", ['receita', 'despesa'])
export const tipoMovimentoStock = pgEnum("tipo_movimento_stock", ['entrada', 'saida', 'ajuste'])
export const tipoPatrocinio = pgEnum("tipo_patrocinio", ['anual', 'pontual'])
export const visibilidade = pgEnum("visibilidade", ['privado', 'restrito', 'publico'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
	password: varchar({ length: 255 }).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }),
	role: varchar({ length: 50 }).default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	profileImageUrl: varchar("profile_image_url", { length: 500 }),
	numeroSocio: varchar("numero_socio", { length: 50 }),
	estado: varchar({ length: 50 }),
	estadoUtilizador: estadoUtilizador("estado_utilizador"),
	nif: varchar({ length: 20 }),
	cartaoCidadao: varchar("cartao_cidadao", { length: 20 }),
	contacto: varchar({ length: 20 }),
	dataNascimento: date("data_nascimento"),
	sexo: sexo(),
	morada: text(),
	codigoPostal: varchar("codigo_postal", { length: 10 }),
	localidade: varchar({ length: 100 }),
	empresa: varchar({ length: 200 }),
	escola: varchar({ length: 200 }),
	estadoCivil: estadoCivil("estado_civil"),
	ocupacao: varchar({ length: 100 }),
	nacionalidade: varchar({ length: 50 }),
	numeroIrmaos: integer("numero_irmaos"),
	menor: boolean().default(false),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	encarregadoId: bigint("encarregado_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	escalaoId: bigint("escalao_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tipoMensalidadeId: bigint("tipo_mensalidade_id", { mode: "number" }),
	profilePhotoPath: varchar("profile_photo_path", { length: 500 }),
	observacoesConfig: text("observacoes_config"),
	emailSecundario: varchar("email_secundario", { length: 200 }),
	tipoMembroId: integer("tipo_membro_id"),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const campanhaLogs = pgTable("campanha_logs", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "campanha_logs_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	campanhaId: integer("campanha_id").notNull(),
	data: date().notNull(),
	canal: varchar({ length: 50 }),
	mensagem: text(),
	alcance: integer(),
	cliques: integer(),
	conversoes: integer(),
	custo: numeric({ precision: 10, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const campanhas = pgTable("campanhas", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "campanhas_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: varchar({ length: 200 }).notNull(),
	objetivo: text(),
	publicoAlvo: text("publico_alvo"),
	canal: canalCampanha().notNull(),
	dataInicio: date("data_inicio").notNull(),
	dataFim: date("data_fim"),
	budget: numeric({ precision: 10, scale:  2 }),
	estado: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const catalogoFaturaItens = pgTable("catalogo_fatura_itens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "catalogo_fatura_itens_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	descricao: varchar({ length: 300 }).notNull(),
	valorUnitario: numeric("valor_unitario", { precision: 10, scale:  2 }).notNull(),
	impostoPercentual: numeric("imposto_percentual", { precision: 5, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const centrosCusto = pgTable("centros_custo", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "centros_custo_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: varchar({ length: 200 }).notNull(),
	tipo: tipoCentroCusto().notNull(),
	referenciaExterna: varchar("referencia_externa", { length: 100 }),
	escalaoId: integer("escalao_id"),
	ativo: boolean().default(true),
	percentagemDistribuicao: numeric("percentagem_distribuicao", { precision: 5, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const crmInteracoes = pgTable("crm_interacoes", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "crm_interacoes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: varchar("user_id").notNull(),
	tipo: tipoInteracao().notNull(),
	assunto: varchar({ length: 300 }),
	descricao: text(),
	proximoPassoData: date("proximo_passo_data"),
	resultado: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const emails = pgTable("emails", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "emails_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	assunto: varchar({ length: 300 }).notNull(),
	mensagem: text().notNull(),
	destinatarios: text().notNull(),
	dataEnvio: timestamp("data_envio", { mode: 'string' }),
	enviado: boolean().default(false),
});

export const emprestimos = pgTable("emprestimos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "emprestimos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	materialId: integer("material_id").notNull(),
	pessoaId: integer("pessoa_id").notNull(),
	dataEmprestimo: date("data_emprestimo").notNull(),
	dataDevolucao: date("data_devolucao"),
	devolvido: boolean().default(false),
});

export const extratosBancarios = pgTable("extratos_bancarios", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "extratos_bancarios_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	conta: varchar({ length: 100 }).notNull(),
	dataMovimento: date("data_movimento").notNull(),
	descricao: varchar({ length: 300 }),
	valor: numeric({ precision: 10, scale:  2 }).notNull(),
	saldo: numeric({ precision: 10, scale:  2 }),
	referencia: varchar({ length: 100 }),
	ficheiroId: integer("ficheiro_id"),
	conciliado: boolean().default(false),
	lancamentoId: integer("lancamento_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const presencasNovo = pgTable("presencas_novo", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	data: date(),
	numeroTreino: integer("numero_treino"),
	presenca: boolean().default(false),
});

export const faturaItens = pgTable("fatura_itens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "fatura_itens_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	faturaId: integer("fatura_id").notNull(),
	descricao: varchar({ length: 300 }).notNull(),
	valorUnitario: numeric("valor_unitario", { precision: 10, scale:  2 }).notNull(),
	quantidade: integer().default(1),
	impostoPercentual: numeric("imposto_percentual", { precision: 5, scale:  2 }),
	totalLinha: numeric("total_linha", { precision: 10, scale:  2 }).notNull(),
	dadosFinanceirosId: integer("dados_financeiros_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const permissions = pgTable("permissions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	guardName: varchar("guard_name", { length: 100 }).default('web').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const roleHasPermissions = pgTable("role_has_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissionId: bigint("permission_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
});

export const roles = pgTable("roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	guardName: varchar("guard_name", { length: 100 }).default('web').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const modelHasRoles = pgTable("model_has_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
	modelType: varchar("model_type", { length: 100 }).notNull(),
	modelId: varchar("model_id", { length: 100 }).notNull(),
});

export const modelHasPermissions = pgTable("model_has_permissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	permissionId: bigint("permission_id", { mode: "number" }).notNull(),
	modelType: varchar("model_type", { length: 100 }).notNull(),
	modelId: varchar("model_id", { length: 100 }).notNull(),
});

export const encarregadoUser = pgTable("encarregado_user", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	encarregadoId: bigint("encarregado_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const userEscaloes = pgTable("user_escaloes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	escalaoId: bigint("escalao_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const escaloes = pgTable("escaloes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nome: varchar({ length: 100 }).notNull(),
	descricao: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	centroCustoId: bigint("centro_custo_id", { mode: "number" }),
});

export const dadosConfiguracao = pgTable("dados_configuracao", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	consentimento: boolean().default(false),
	dataConsentimento: timestamp("data_consentimento", { mode: 'string' }),
	ficheiroConsentimento: varchar("ficheiro_consentimento", { length: 500 }),
	declaracaoTransporte: boolean("declaracao_transporte").default(false),
	dataTransporte: timestamp("data_transporte", { mode: 'string' }),
	ficheiroTransporte: varchar("ficheiro_transporte", { length: 500 }),
	afiliacao: boolean().default(false),
	dataAfiliacao: timestamp("data_afiliacao", { mode: 'string' }),
	ficheiroAfiliacao: varchar("ficheiro_afiliacao", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	rgpdAssinado: boolean("rgpd_assinado").default(false),
});

export const saudeAtletas = pgTable("saude_atletas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	patologias: text(),
	medicamentos: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const treinos = pgTable("treinos", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	numero: integer().notNull(),
	data: date().notNull(),
	sessao: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const presencas = pgTable("presencas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pessoaId: bigint("pessoa_id", { mode: "number" }).notNull(),
	data: date().notNull(),
	numeroTreino: smallint("numero_treino").notNull(),
	presenca: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const resultados = pgTable("resultados", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	epoca: varchar({ length: 10 }),
	data: date().notNull(),
	escalao: varchar({ length: 100 }),
	competicao: varchar({ length: 200 }).notNull(),
	local: varchar({ length: 200 }),
	piscina: varchar({ length: 50 }),
	prova: varchar({ length: 200 }).notNull(),
	tempo: varchar({ length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const dadosDesportivos = pgTable("dados_desportivos", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	altura: numeric({ precision: 5, scale:  2 }),
	peso: numeric({ precision: 5, scale:  2 }),
	batimento: integer(),
	observacoes: text(),
	patologias: text(),
	medicamentos: text(),
	numeroFederacao: varchar("numero_federacao", { length: 50 }),
	pmb: varchar({ length: 50 }),
	dataInscricao: date("data_inscricao"),
	atestadoMedico: boolean("atestado_medico").default(false),
	dataAtestado: date("data_atestado"),
	informacoesMedicas: text("informacoes_medicas"),
	arquivoAmPath: varchar("arquivo_am_path", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	cartaoFederacao: varchar("cartao_federacao", { length: 200 }),
	arquivoInscricao: varchar("arquivo_inscricao", { length: 500 }),
});

export const eventosTipos = pgTable("eventos_tipos", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nome: varchar({ length: 100 }).notNull(),
	cor: varchar({ length: 7 }),
	icon: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const eventos = pgTable("eventos", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	titulo: varchar({ length: 200 }).notNull(),
	descricao: text(),
	transporte: boolean().default(false),
	dataInicio: date("data_inicio").notNull(),
	dataFim: date("data_fim"),
	local: varchar({ length: 200 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tipoEventoId: bigint("tipo_evento_id", { mode: "number" }),
	visibilidade: visibilidade().default('privado'),
	transporteDisponivel: boolean("transporte_disponivel").default(false),
	localPartida: varchar("local_partida", { length: 200 }),
	horaPartida: varchar("hora_partida", { length: 10 }),
	observacoes: text(),
	convocatoriaPath: varchar("convocatoria_path", { length: 500 }),
	regulamentoPath: varchar("regulamento_path", { length: 500 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	convocatoriaId: bigint("convocatoria_id", { mode: "number" }),
	temTransporte: boolean("tem_transporte").default(false),
	transporteDescricao: text("transporte_descricao"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	regulamentoId: bigint("regulamento_id", { mode: "number" }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const convocatorias = pgTable("convocatorias", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	titulo: varchar({ length: 200 }).notNull(),
	data: date().notNull(),
	ficheiroPath: varchar("ficheiro_path", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const eventoEscalao = pgTable("evento_escalao", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	eventoId: bigint("evento_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	escalaoId: bigint("escalao_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const pessoas = pgTable("pessoas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	nome: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	telemovel: varchar({ length: 30 }),
	dataNascimento: date("data_nascimento"),
	sexo: varchar({ length: 10 }),
	nif: varchar({ length: 20 }),
	morada: varchar({ length: 255 }),
	cp: varchar({ length: 20 }),
	localidade: varchar({ length: 120 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const atividades = pgTable("atividades", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	nome: varchar({ length: 180 }).notNull(),
	descricao: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const eventosUsers = pgTable("eventos_users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	eventoId: bigint("evento_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	convocado: boolean().default(false),
	presencaConfirmada: boolean("presenca_confirmada").default(false),
	justificacao: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const lancamentosFinanceiros = pgTable("lancamentos_financeiros", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "lancamentos_financeiros_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	data: date().notNull(),
	descricao: varchar({ length: 300 }).notNull(),
	tipo: tipoLancamento().notNull(),
	valor: numeric({ precision: 10, scale:  2 }).notNull(),
	metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
	documentoRef: varchar("documento_ref", { length: 100 }),
	userId: varchar("user_id"),
	centroCustoId: integer("centro_custo_id"),
	faturaId: integer("fatura_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const tiposMensalidade = pgTable("tipos_mensalidade", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	designacao: varchar({ length: 200 }).notNull(),
	valor: numeric({ precision: 10, scale:  2 }).notNull(),
	descricao: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const faturas = pgTable("faturas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	dataFatura: date("data_fatura").notNull(),
	mes: varchar({ length: 7 }).notNull(),
	mesReferencia: varchar("mes_referencia", { length: 7 }),
	dataEmissao: date("data_emissao"),
	estado: estadoFatura().default('pendente'),
	total: numeric({ precision: 12, scale:  2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	valor: numeric({ precision: 12, scale:  2 }).default('0'),
	dataVencimento: date("data_vencimento"),
});

export const dadosFinanceiros = pgTable("dados_financeiros", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	estadoPagamento: varchar("estado_pagamento", { length: 50 }),
	numeroRecibo: varchar("numero_recibo", { length: 100 }),
	referenciaPagamento: varchar("referencia_pagamento", { length: 100 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mensalidadeId: bigint("mensalidade_id", { mode: "number" }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	contaCorrente: varchar("conta_corrente", { length: 50 }),
});

export const mapaConciliacao = pgTable("mapa_conciliacao", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "mapa_conciliacao_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	extratoId: integer("extrato_id").notNull(),
	lancamentoId: integer("lancamento_id").notNull(),
	status: statusConciliacao().default('sugerido'),
	regraUsada: varchar("regra_usada", { length: 200 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const materiais = pgTable("materiais", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "materiais_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: varchar({ length: 200 }).notNull(),
	categoria: varchar({ length: 100 }),
	quantidade: integer().default(0),
	localizacao: varchar({ length: 200 }),
	status: varchar({ length: 50 }).notNull(),
	stockBaixo: boolean("stock_baixo").default(false),
});

export const mensalidades = pgTable("mensalidades", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "mensalidades_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	pessoaId: integer("pessoa_id").notNull(),
	valor: numeric({ precision: 10, scale:  2 }).notNull(),
	mes: integer().notNull(),
	ano: integer().notNull(),
	dataVencimento: date("data_vencimento").notNull(),
	dataPagamento: date("data_pagamento"),
	status: varchar({ length: 20 }).notNull(),
	descricao: text(),
});

export const movimentosStock = pgTable("movimentos_stock", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "movimentos_stock_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	produtoId: integer("produto_id").notNull(),
	tipo: tipoMovimentoStock().notNull(),
	quantidade: integer().notNull(),
	motivo: varchar({ length: 300 }),
	documentoRef: varchar("documento_ref", { length: 100 }),
	userId: varchar("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const noticias = pgTable("noticias", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "noticias_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	titulo: varchar({ length: 300 }).notNull(),
	slug: varchar({ length: 300 }).notNull(),
	resumo: text(),
	corpoHtml: text("corpo_html").notNull(),
	imagemCapa: varchar("imagem_capa", { length: 500 }),
	destaque: boolean().default(false),
	publicadoEm: timestamp("publicado_em", { mode: 'string' }),
	autorId: varchar("autor_id"),
	estado: estadoNoticia().default('rascunho'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("noticias_slug_unique").on(table.slug),
]);

export const patrocinadores = pgTable("patrocinadores", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "patrocinadores_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: varchar({ length: 200 }).notNull(),
	nif: varchar({ length: 9 }),
	email: varchar({ length: 200 }),
	telefone: varchar({ length: 20 }),
	morada: text(),
	site: varchar({ length: 300 }),
	notas: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const patrocinioMetricas = pgTable("patrocinio_metricas", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "patrocinio_metricas_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	patrocinioId: integer("patrocinio_id").notNull(),
	impressoes: integer(),
	cliques: integer(),
	exposicoesEventos: integer("exposicoes_eventos"),
	mencoesSocial: integer("mencoes_social"),
	observacoes: text(),
	periodo: varchar({ length: 7 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const patrocinioParcelas = pgTable("patrocinio_parcelas", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "patrocinio_parcelas_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	patrocinioId: integer("patrocinio_id").notNull(),
	dataVencimento: date("data_vencimento").notNull(),
	valor: numeric({ precision: 10, scale:  2 }).notNull(),
	pago: boolean().default(false),
	dataPagamento: date("data_pagamento"),
	referenciaPagamento: varchar("referencia_pagamento", { length: 100 }),
	faturaId: integer("fatura_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const patrocinios = pgTable("patrocinios", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "patrocinios_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	patrocinadorId: integer("patrocinador_id").notNull(),
	titulo: varchar({ length: 200 }).notNull(),
	tipo: tipoPatrocinio().notNull(),
	dataInicio: date("data_inicio").notNull(),
	dataFim: date("data_fim"),
	valorTotal: numeric("valor_total", { precision: 10, scale:  2 }).notNull(),
	contrapartidas: text(),
	estado: estadoPatrocinio().default('ativo'),
	contratoPath: varchar("contrato_path", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const produtos = pgTable("produtos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "produtos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	sku: varchar({ length: 100 }),
	nome: varchar({ length: 200 }).notNull(),
	descricao: text(),
	preco: numeric({ precision: 10, scale:  2 }).notNull(),
	taxaIva: numeric("taxa_iva", { precision: 5, scale:  2 }),
	ativo: boolean().default(true),
	stockAtual: integer("stock_atual").default(0),
	stockMinimo: integer("stock_minimo").default(0),
	imagens: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("produtos_sku_unique").on(table.sku),
]);

export const vendaItens = pgTable("venda_itens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "venda_itens_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	vendaId: integer("venda_id").notNull(),
	produtoId: integer("produto_id"),
	descricao: varchar({ length: 300 }).notNull(),
	quantidade: integer().default(1),
	precoUnitario: numeric("preco_unitario", { precision: 10, scale:  2 }).notNull(),
	taxaIva: numeric("taxa_iva", { precision: 5, scale:  2 }),
	totalLinha: numeric("total_linha", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const vendas = pgTable("vendas", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "vendas_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	data: date().notNull(),
	clienteNome: varchar("cliente_nome", { length: 200 }),
	clienteNif: varchar("cliente_nif", { length: 9 }),
	totalBruto: numeric("total_bruto", { precision: 10, scale:  2 }).notNull(),
	totalIva: numeric("total_iva", { precision: 10, scale:  2 }).notNull(),
	totalLiquido: numeric("total_liquido", { precision: 10, scale:  2 }).notNull(),
	metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
	faturaId: integer("fatura_id"),
	userId: varchar("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
