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
CREATE TABLE "atividades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "atividades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"titulo" varchar(200) NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"data" date NOT NULL,
	"hora" varchar(10),
	"local" varchar(200),
	"descricao" text,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "convocatorias" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "convocatorias_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"titulo" varchar(200) NOT NULL,
	"data" date NOT NULL,
	"ficheiro_path" varchar(500),
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
CREATE TABLE "dados_configuracao" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dados_configuracao_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
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
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dados_desportivos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dados_desportivos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
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
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dados_financeiros" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dados_financeiros_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"estado_pagamento" varchar(50),
	"numero_recibo" varchar(100),
	"referencia_pagamento" varchar(100),
	"mensalidade_id" integer,
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
CREATE TABLE "encarregado_user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "encarregado_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"encarregado_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "escaloes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "escaloes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(100) NOT NULL,
	"descricao" text,
	"centro_custo_id" integer,
	CONSTRAINT "escaloes_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "evento_escalao" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "evento_escalao_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"evento_id" integer NOT NULL,
	"escalao_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "eventos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"titulo" varchar(200) NOT NULL,
	"descricao" text,
	"transporte" boolean DEFAULT false,
	"data_inicio" date NOT NULL,
	"data_fim" date,
	"local" varchar(200),
	"tipo_evento_id" integer,
	"visibilidade" "visibilidade" DEFAULT 'privado',
	"transporte_disponivel" boolean DEFAULT false,
	"local_partida" varchar(200),
	"hora_partida" varchar(10),
	"observacoes" text,
	"convocatoria_path" varchar(500),
	"regulamento_path" varchar(500),
	"convocatoria_id" integer,
	"tem_transporte" boolean DEFAULT false,
	"transporte_descricao" text,
	"regulamento_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventos_tipos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "eventos_tipos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(100) NOT NULL,
	"cor" varchar(7),
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventos_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "eventos_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"evento_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"convocado" boolean DEFAULT false,
	"presenca_confirmada" boolean DEFAULT false,
	"justificacao" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
CREATE TABLE "faturas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "faturas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"data_fatura" date NOT NULL,
	"mes" varchar(7) NOT NULL,
	"mes_referencia" varchar(7),
	"data_emissao" date,
	"data_vencimento" date,
	"valor" numeric(10, 2) NOT NULL,
	"estado_pagamento" boolean DEFAULT false,
	"estado" "estado_fatura" DEFAULT 'pendente',
	"numero_recibo" varchar(100),
	"referencia_pagamento" varchar(100),
	"gerada_automaticamente" boolean DEFAULT false,
	"epoca" varchar(10),
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
CREATE TABLE "model_has_permissions" (
	"permission_id" integer NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"model_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_has_roles" (
	"role_id" integer NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"model_id" varchar(100) NOT NULL
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
CREATE TABLE "permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"guard_name" varchar(100) DEFAULT 'web' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "pessoas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pessoas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"nome" varchar(200) NOT NULL,
	"email" varchar(200),
	"telemovel" varchar(20),
	"data_nascimento" date,
	"nif" varchar(20),
	"morada" varchar(500),
	"cp" varchar(20),
	"localidade" varchar(200),
	"sexo" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "presencas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "presencas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"atividade_id" integer NOT NULL,
	"pessoa_id" integer NOT NULL,
	"presente" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "presencas_novo" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "presencas_novo_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"data" date NOT NULL,
	"numero_treino" integer NOT NULL,
	"presenca" boolean DEFAULT false,
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
CREATE TABLE "resultados" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resultados_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
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
CREATE TABLE "role_has_permissions" (
	"permission_id" integer NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"guard_name" varchar(100) DEFAULT 'web' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "saude_atletas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "saude_atletas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"patologias" text,
	"medicamentos" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tipos_mensalidade" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tipos_mensalidade_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"designacao" varchar(200) NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"descricao" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "treinos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "treinos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"numero" integer NOT NULL,
	"data" date NOT NULL,
	"sessao" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_escaloes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_escaloes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar NOT NULL,
	"escalao_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"numero_socio" varchar(50),
	"name" varchar(200),
	"estado" varchar(50),
	"estado_utilizador" "estado_utilizador" DEFAULT 'ativo',
	"nif" varchar(9),
	"cartao_cidadao" varchar(20),
	"contacto" varchar(20),
	"data_nascimento" date,
	"sexo" "sexo",
	"morada" text,
	"codigo_postal" varchar(10),
	"localidade" varchar(100),
	"email_secundario" varchar(200),
	"empresa" varchar(200),
	"escola" varchar(200),
	"estado_civil" "estado_civil",
	"ocupacao" varchar(100),
	"nacionalidade" varchar(50),
	"numero_irmaos" integer,
	"menor" boolean DEFAULT false,
	"encarregado_id" integer,
	"escalao_id" integer,
	"tipo_mensalidade_id" integer,
	"tipo_membro_id" integer,
	"conta_corrente" varchar(100),
	"email_verified_at" timestamp,
	"password" varchar(255),
	"remember_token" varchar(100),
	"role" varchar(50) DEFAULT 'membro',
	"profile_photo_path" varchar(500),
	"observacoes_config" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
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
ALTER TABLE "campanha_logs" ADD CONSTRAINT "campanha_logs_campanha_id_campanhas_id_fk" FOREIGN KEY ("campanha_id") REFERENCES "public"."campanhas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "centros_custo" ADD CONSTRAINT "centros_custo_escalao_id_escaloes_id_fk" FOREIGN KEY ("escalao_id") REFERENCES "public"."escaloes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_interacoes" ADD CONSTRAINT "crm_interacoes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dados_configuracao" ADD CONSTRAINT "dados_configuracao_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dados_desportivos" ADD CONSTRAINT "dados_desportivos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dados_financeiros" ADD CONSTRAINT "dados_financeiros_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dados_financeiros" ADD CONSTRAINT "dados_financeiros_mensalidade_id_tipos_mensalidade_id_fk" FOREIGN KEY ("mensalidade_id") REFERENCES "public"."tipos_mensalidade"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_material_id_materiais_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materiais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_pessoa_id_pessoas_id_fk" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encarregado_user" ADD CONSTRAINT "encarregado_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encarregado_user" ADD CONSTRAINT "encarregado_user_encarregado_id_users_id_fk" FOREIGN KEY ("encarregado_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escaloes" ADD CONSTRAINT "escaloes_centro_custo_id_centros_custo_id_fk" FOREIGN KEY ("centro_custo_id") REFERENCES "public"."centros_custo"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evento_escalao" ADD CONSTRAINT "evento_escalao_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evento_escalao" ADD CONSTRAINT "evento_escalao_escalao_id_escaloes_id_fk" FOREIGN KEY ("escalao_id") REFERENCES "public"."escaloes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tipo_evento_id_eventos_tipos_id_fk" FOREIGN KEY ("tipo_evento_id") REFERENCES "public"."eventos_tipos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_convocatoria_id_convocatorias_id_fk" FOREIGN KEY ("convocatoria_id") REFERENCES "public"."convocatorias"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos_users" ADD CONSTRAINT "eventos_users_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos_users" ADD CONSTRAINT "eventos_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extratos_bancarios" ADD CONSTRAINT "extratos_bancarios_lancamento_id_lancamentos_financeiros_id_fk" FOREIGN KEY ("lancamento_id") REFERENCES "public"."lancamentos_financeiros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fatura_itens" ADD CONSTRAINT "fatura_itens_fatura_id_faturas_id_fk" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fatura_itens" ADD CONSTRAINT "fatura_itens_dados_financeiros_id_dados_financeiros_id_fk" FOREIGN KEY ("dados_financeiros_id") REFERENCES "public"."dados_financeiros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faturas" ADD CONSTRAINT "faturas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_centro_custo_id_centros_custo_id_fk" FOREIGN KEY ("centro_custo_id") REFERENCES "public"."centros_custo"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_fatura_id_faturas_id_fk" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mapa_conciliacao" ADD CONSTRAINT "mapa_conciliacao_extrato_id_extratos_bancarios_id_fk" FOREIGN KEY ("extrato_id") REFERENCES "public"."extratos_bancarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mapa_conciliacao" ADD CONSTRAINT "mapa_conciliacao_lancamento_id_lancamentos_financeiros_id_fk" FOREIGN KEY ("lancamento_id") REFERENCES "public"."lancamentos_financeiros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensalidades" ADD CONSTRAINT "mensalidades_pessoa_id_pessoas_id_fk" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimentos_stock" ADD CONSTRAINT "movimentos_stock_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimentos_stock" ADD CONSTRAINT "movimentos_stock_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_autor_id_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patrocinio_metricas" ADD CONSTRAINT "patrocinio_metricas_patrocinio_id_patrocinios_id_fk" FOREIGN KEY ("patrocinio_id") REFERENCES "public"."patrocinios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patrocinio_parcelas" ADD CONSTRAINT "patrocinio_parcelas_patrocinio_id_patrocinios_id_fk" FOREIGN KEY ("patrocinio_id") REFERENCES "public"."patrocinios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patrocinio_parcelas" ADD CONSTRAINT "patrocinio_parcelas_fatura_id_faturas_id_fk" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patrocinios" ADD CONSTRAINT "patrocinios_patrocinador_id_patrocinadores_id_fk" FOREIGN KEY ("patrocinador_id") REFERENCES "public"."patrocinadores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_atividade_id_atividades_id_fk" FOREIGN KEY ("atividade_id") REFERENCES "public"."atividades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_pessoa_id_pessoas_id_fk" FOREIGN KEY ("pessoa_id") REFERENCES "public"."pessoas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presencas_novo" ADD CONSTRAINT "presencas_novo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultados" ADD CONSTRAINT "resultados_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saude_atletas" ADD CONSTRAINT "saude_atletas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treinos" ADD CONSTRAINT "treinos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_escaloes" ADD CONSTRAINT "user_escaloes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_escaloes" ADD CONSTRAINT "user_escaloes_escalao_id_escaloes_id_fk" FOREIGN KEY ("escalao_id") REFERENCES "public"."escaloes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_encarregado_id_users_id_fk" FOREIGN KEY ("encarregado_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_escalao_id_escaloes_id_fk" FOREIGN KEY ("escalao_id") REFERENCES "public"."escaloes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tipo_mensalidade_id_tipos_mensalidade_id_fk" FOREIGN KEY ("tipo_mensalidade_id") REFERENCES "public"."tipos_mensalidade"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venda_itens" ADD CONSTRAINT "venda_itens_venda_id_vendas_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."vendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venda_itens" ADD CONSTRAINT "venda_itens_produto_id_produtos_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_fatura_id_faturas_id_fk" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");