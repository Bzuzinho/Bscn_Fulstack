-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."canal_campanha" AS ENUM('email', 'social', 'site');--> statement-breakpoint
CREATE TYPE "public"."estado_civil" AS ENUM('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto');--> statement-breakpoint
CREATE TYPE "public"."estado_fatura" AS ENUM('futuro', 'pendente', 'em_divida', 'paga', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."estado_noticia" AS ENUM('rascunho', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."estado_patrocinio" AS ENUM('ativo', 'suspenso', 'terminado');--> statement-breakpoint
CREATE TYPE "public"."estado_utilizador" AS ENUM('ativo', 'inativo', 'suspenso');--> statement-breakpoint
CREATE TYPE "public"."sexo" AS ENUM('M', 'F', 'Outro');--> statement-breakpoint
CREATE TYPE "public"."status_conciliacao" AS ENUM('sugerido', 'confirmado', 'rejeitado');--> statement-breakpoint
CREATE TYPE "public"."tipo_centro_custo" AS ENUM('escalao', 'departamento', 'clube_generico');--> statement-breakpoint
CREATE TYPE "public"."tipo_interacao" AS ENUM('email', 'telefone', 'reuniao', 'outro');--> statement-breakpoint
CREATE TYPE "public"."tipo_lancamento" AS ENUM('receita', 'despesa');--> statement-breakpoint
CREATE TYPE "public"."tipo_movimento_stock" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TYPE "public"."tipo_patrocinio" AS ENUM('anual', 'pontual');--> statement-breakpoint
CREATE TYPE "public"."visibilidade" AS ENUM('privado', 'restrito', 'publico');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp(0),
	"password" varchar(255) NOT NULL,
	"remember_token" varchar(100),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp(0),
	"updated_at" timestamp(0),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"profile_image_url" varchar(500),
	"numero_socio" varchar(50),
	"estado" varchar(50),
	"estado_utilizador" "estado_utilizador",
	"nif" varchar(20),
	"cartao_cidadao" varchar(20),
	"contacto" varchar(20),
	"data_nascimento" date,
	"sexo" "sexo",
	"morada" text,
	"codigo_postal" varchar(10),
	"localidade" varchar(100),
	"empresa" varchar(200),
	"escola" varchar(200),
	"estado_civil" "estado_civil",
	"ocupacao" varchar(100),
	"nacionalidade" varchar(50),
	"numero_irmaos" integer,
	"menor" boolean DEFAULT false,
	"encarregado_id" bigint,
	"escalao_id" bigint,
	"tipo_mensalidade_id" bigint,
	"profile_photo_path" varchar(500),
	"observacoes_config" text,
	"email_secundario" varchar(200),
	"tipo_membro_id" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campanha_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "campanha_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"campanha_id" integer NOT NULL,
	"data" date NOT NULL,
	"canal" varchar(50),
	"mensagem" text,
	"alcance" integer,
	"cliques" integer,
	"conversoes" integer,
	"custo" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campanhas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "campanhas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(200) NOT NULL,
	"objetivo" text,
	"publico_alvo" text,
	"canal" "canal_campanha" NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date,
	"budget" numeric(10, 2),
	"estado" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalogo_fatura_itens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "catalogo_fatura_itens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"descricao" varchar(300) NOT NULL,
	"valor_unitario" numeric(10, 2) NOT NULL,
	"imposto_percentual" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "centros_custo" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "centros_custo_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(200) NOT NULL,
	"tipo" "tipo_centro_custo" NOT NULL,
	"referencia_externa" varchar(100),
	"escalao_id" integer,
	"ativo" boolean DEFAULT true,
	"percentagem_distribuicao" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crm_interacoes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "crm_interacoes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"tipo" "tipo_interacao" NOT NULL,
	"assunto" varchar(300),
	"descricao" text,
	"proximo_passo_data" date,
	"resultado" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "emails_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"assunto" varchar(300) NOT NULL,
	"mensagem" text NOT NULL,
	"destinatarios" text NOT NULL,
	"data_envio" timestamp,
	"enviado" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "emprestimos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "emprestimos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"material_id" integer NOT NULL,
	"pessoa_id" integer NOT NULL,
	"data_emprestimo" date NOT NULL,
	"data_devolucao" date,
	"devolvido" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "extratos_bancarios" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "extratos_bancarios_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"conta" varchar(100) NOT NULL,
	"data_movimento" date NOT NULL,
	"descricao" varchar(300),
	"valor" numeric(10, 2) NOT NULL,
	"saldo" numeric(10, 2),
	"referencia" varchar(100),
	"ficheiro_id" integer,
	"conciliado" boolean DEFAULT false,
	"lancamento_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "presencas_novo" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" bigint,
	"data" date,
	"numero_treino" integer,
	"presenca" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "fatura_itens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fatura_itens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fatura_id" integer NOT NULL,
	"descricao" varchar(300) NOT NULL,
	"valor_unitario" numeric(10, 2) NOT NULL,
	"quantidade" integer DEFAULT 1,
	"imposto_percentual" numeric(5, 2),
	"total_linha" numeric(10, 2) NOT NULL,
	"dados_financeiros_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"guard_name" varchar(100) DEFAULT 'web' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role_has_permissions" (
	"permission_id" bigint NOT NULL,
	"role_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"guard_name" varchar(100) DEFAULT 'web' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_has_roles" (
	"role_id" bigint NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"model_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_has_permissions" (
	"permission_id" bigint NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"model_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encarregado_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"encarregado_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_escaloes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"escalao_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "escaloes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"descricao" text,
	"centro_custo_id" bigint
);
--> statement-breakpoint
CREATE TABLE "dados_configuracao" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"consentimento" boolean DEFAULT false,
	"data_consentimento" timestamp,
	"ficheiro_consentimento" varchar(500),
	"declaracao_transporte" boolean DEFAULT false,
	"data_transporte" timestamp,
	"ficheiro_transporte" varchar(500),
	"afiliacao" boolean DEFAULT false,
	"data_afiliacao" timestamp,
	"ficheiro_afiliacao" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"rgpd_assinado" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "saude_atletas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"patologias" text,
	"medicamentos" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "treinos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"numero" integer NOT NULL,
	"data" date NOT NULL,
	"sessao" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "presencas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"pessoa_id" bigint NOT NULL,
	"data" date NOT NULL,
	"numero_treino" smallint NOT NULL,
	"presenca" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resultados" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"epoca" varchar(10),
	"data" date NOT NULL,
	"escalao" varchar(100),
	"competicao" varchar(200) NOT NULL,
	"local" varchar(200),
	"piscina" varchar(50),
	"prova" varchar(200) NOT NULL,
	"tempo" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dados_desportivos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"altura" numeric(5, 2),
	"peso" numeric(5, 2),
	"batimento" integer,
	"observacoes" text,
	"patologias" text,
	"medicamentos" text,
	"numero_federacao" varchar(50),
	"pmb" varchar(50),
	"data_inscricao" date,
	"atestado_medico" boolean DEFAULT false,
	"data_atestado" date,
	"informacoes_medicas" text,
	"arquivo_am_path" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"cartao_federacao" varchar(200),
	"arquivo_inscricao" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "eventos_tipos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"cor" varchar(7),
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"descricao" text,
	"transporte" boolean DEFAULT false,
	"data_inicio" date NOT NULL,
	"data_fim" date,
	"local" varchar(200),
	"tipo_evento_id" bigint,
	"visibilidade" "visibilidade" DEFAULT 'privado',
	"transporte_disponivel" boolean DEFAULT false,
	"local_partida" varchar(200),
	"hora_partida" varchar(10),
	"observacoes" text,
	"convocatoria_path" varchar(500),
	"regulamento_path" varchar(500),
	"convocatoria_id" bigint,
	"tem_transporte" boolean DEFAULT false,
	"transporte_descricao" text,
	"regulamento_id" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "convocatorias" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"data" date NOT NULL,
	"ficheiro_path" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evento_escalao" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"evento_id" bigint NOT NULL,
	"escalao_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pessoas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255),
	"telemovel" varchar(30),
	"data_nascimento" date,
	"sexo" varchar(10),
	"nif" varchar(20),
	"morada" varchar(255),
	"cp" varchar(20),
	"localidade" varchar(120),
	"created_at" timestamp(0),
	"updated_at" timestamp(0)
);
--> statement-breakpoint
CREATE TABLE "atividades" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"nome" varchar(180) NOT NULL,
	"descricao" text,
	"created_at" timestamp(0),
	"updated_at" timestamp(0)
);
--> statement-breakpoint
CREATE TABLE "eventos_users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"evento_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"convocado" boolean DEFAULT false,
	"presenca_confirmada" boolean DEFAULT false,
	"justificacao" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lancamentos_financeiros" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lancamentos_financeiros_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"data" date NOT NULL,
	"descricao" varchar(300) NOT NULL,
	"tipo" "tipo_lancamento" NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"metodo_pagamento" varchar(50),
	"documento_ref" varchar(100),
	"user_id" varchar,
	"centro_custo_id" integer,
	"fatura_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tipos_mensalidade" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"designacao" varchar(200) NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"descricao" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "faturas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"data_fatura" date NOT NULL,
	"mes" varchar(7) NOT NULL,
	"mes_referencia" varchar(7),
	"data_emissao" date,
	"estado" "estado_fatura" DEFAULT 'pendente',
	"total" numeric(12, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"valor" numeric(12, 2) DEFAULT '0',
	"data_vencimento" date
);
--> statement-breakpoint
CREATE TABLE "dados_financeiros" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"estado_pagamento" varchar(50),
	"numero_recibo" varchar(100),
	"referencia_pagamento" varchar(100),
	"mensalidade_id" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"conta_corrente" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "mapa_conciliacao" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mapa_conciliacao_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"extrato_id" integer NOT NULL,
	"lancamento_id" integer NOT NULL,
	"status" "status_conciliacao" DEFAULT 'sugerido',
	"regra_usada" varchar(200),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "materiais" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "materiais_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(200) NOT NULL,
	"categoria" varchar(100),
	"quantidade" integer DEFAULT 0,
	"localizacao" varchar(200),
	"status" varchar(50) NOT NULL,
	"stock_baixo" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "mensalidades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mensalidades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pessoa_id" integer NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"mes" integer NOT NULL,
	"ano" integer NOT NULL,
	"data_vencimento" date NOT NULL,
	"data_pagamento" date,
	"status" varchar(20) NOT NULL,
	"descricao" text
);
--> statement-breakpoint
CREATE TABLE "movimentos_stock" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movimentos_stock_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"produto_id" integer NOT NULL,
	"tipo" "tipo_movimento_stock" NOT NULL,
	"quantidade" integer NOT NULL,
	"motivo" varchar(300),
	"documento_ref" varchar(100),
	"user_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "noticias" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "noticias_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"titulo" varchar(300) NOT NULL,
	"slug" varchar(300) NOT NULL,
	"resumo" text,
	"corpo_html" text NOT NULL,
	"imagem_capa" varchar(500),
	"destaque" boolean DEFAULT false,
	"publicado_em" timestamp,
	"autor_id" varchar,
	"estado" "estado_noticia" DEFAULT 'rascunho',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "noticias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "patrocinadores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patrocinadores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(200) NOT NULL,
	"nif" varchar(9),
	"email" varchar(200),
	"telefone" varchar(20),
	"morada" text,
	"site" varchar(300),
	"notas" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patrocinio_metricas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patrocinio_metricas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patrocinio_id" integer NOT NULL,
	"impressoes" integer,
	"cliques" integer,
	"exposicoes_eventos" integer,
	"mencoes_social" integer,
	"observacoes" text,
	"periodo" varchar(7),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patrocinio_parcelas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patrocinio_parcelas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patrocinio_id" integer NOT NULL,
	"data_vencimento" date NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"pago" boolean DEFAULT false,
	"data_pagamento" date,
	"referencia_pagamento" varchar(100),
	"fatura_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patrocinios" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patrocinios_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patrocinador_id" integer NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"tipo" "tipo_patrocinio" NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date,
	"valor_total" numeric(10, 2) NOT NULL,
	"contrapartidas" text,
	"estado" "estado_patrocinio" DEFAULT 'ativo',
	"contrato_path" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "produtos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sku" varchar(100),
	"nome" varchar(200) NOT NULL,
	"descricao" text,
	"preco" numeric(10, 2) NOT NULL,
	"taxa_iva" numeric(5, 2),
	"ativo" boolean DEFAULT true,
	"stock_atual" integer DEFAULT 0,
	"stock_minimo" integer DEFAULT 0,
	"imagens" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "produtos_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "venda_itens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "venda_itens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"venda_id" integer NOT NULL,
	"produto_id" integer,
	"descricao" varchar(300) NOT NULL,
	"quantidade" integer DEFAULT 1,
	"preco_unitario" numeric(10, 2) NOT NULL,
	"taxa_iva" numeric(5, 2),
	"total_linha" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"data" date NOT NULL,
	"cliente_nome" varchar(200),
	"cliente_nif" varchar(9),
	"total_bruto" numeric(10, 2) NOT NULL,
	"total_iva" numeric(10, 2) NOT NULL,
	"total_liquido" numeric(10, 2) NOT NULL,
	"metodo_pagamento" varchar(50),
	"fatura_id" integer,
	"user_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire" timestamp_ops);
*/