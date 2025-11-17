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
