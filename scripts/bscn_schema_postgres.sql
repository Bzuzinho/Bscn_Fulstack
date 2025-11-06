-- Postgres schema for BSCN app (derived from shared/schema.ts and MySQL dump bscn24102025.sql)
-- Safe, idempotent CREATE statements (IF NOT EXISTS) for Neon
-- Run this in Neon SQL editor. It creates enums as plain types where appropriate and tables with sensible types.

-- ENUMS (use text columns if you prefer avoiding enums)
DO $$ BEGIN
    CREATE TYPE estado_utilizador AS ENUM ('ativo','inativo','suspenso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sexo AS ENUM ('M','F','Outro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_civil AS ENUM ('solteiro','casado','divorciado','viuvo','uniao_facto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visibilidade AS ENUM ('privado','restrito','publico');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_fatura AS ENUM ('futuro','pendente','em_divida','paga','cancelada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- SESSIONS (for connect-pg-simple / Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions (expire);

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  email varchar(255) UNIQUE,
  first_name varchar(200),
  last_name varchar(200),
  profile_image_url varchar(500),
  numero_socio varchar(50),
  name varchar(200),
  estado varchar(50),
  estado_utilizador estado_utilizador DEFAULT 'ativo',
  nif varchar(20),
  cartao_cidadao varchar(50),
  contacto varchar(50),
  data_nascimento date,
  sexo sexo,
  morada text,
  codigo_postal varchar(20),
  localidade varchar(200),
  empresa varchar(200),
  escola varchar(200),
  estado_civil estado_civil,
  ocupacao varchar(100),
  nacionalidade varchar(100),
  numero_irmaos integer,
  menor boolean DEFAULT false,
  encarregado_id bigint,
  escalao_id bigint,
  tipo_mensalidade_id bigint,
  email_verified_at timestamp,
  password varchar(255),
  remember_token varchar(100),
  role varchar(50) DEFAULT 'membro',
  profile_photo_path varchar(500),
  observacoes_config text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ROLES / PERMISSIONS / RBAC tables
CREATE TABLE IF NOT EXISTS roles (
  id bigserial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  guard_name varchar(100) NOT NULL DEFAULT 'web',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id bigserial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  guard_name varchar(100) NOT NULL DEFAULT 'web',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_has_permissions (
  permission_id bigint NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  role_id bigint NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (permission_id, role_id)
);

CREATE TABLE IF NOT EXISTS model_has_roles (
  role_id bigint NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  model_type varchar(100) NOT NULL,
  model_id varchar(100) NOT NULL,
  PRIMARY KEY (role_id, model_type, model_id)
);

CREATE TABLE IF NOT EXISTS model_has_permissions (
  permission_id bigint NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  model_type varchar(100) NOT NULL,
  model_id varchar(100) NOT NULL,
  PRIMARY KEY (permission_id, model_type, model_id)
);

-- Dados Configuracao (RGPD)
CREATE TABLE IF NOT EXISTS dados_configuracao (
  id bigserial PRIMARY KEY,
  user_id bigint REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  consentimento boolean DEFAULT false,
  data_consentimento timestamp,
  ficheiro_consentimento varchar(500),
  declaracao_transporte boolean DEFAULT false,
  data_transporte timestamp,
  ficheiro_transporte varchar(500),
  afiliacao boolean DEFAULT false,
  data_afiliacao timestamp,
  ficheiro_afiliacao varchar(500),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Escaloes / user_escaloes
CREATE TABLE IF NOT EXISTS escaloes (
  id bigserial PRIMARY KEY,
  nome varchar(100) NOT NULL UNIQUE,
  descricao text,
  centro_custo_id bigint
);

CREATE TABLE IF NOT EXISTS user_escaloes (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  escalao_id bigint NOT NULL REFERENCES escaloes(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Encarregado (guardian) mapping
CREATE TABLE IF NOT EXISTS encarregado_user (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  encarregado_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Dados desportivos & saude_atletas
CREATE TABLE IF NOT EXISTS dados_desportivos (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  altura numeric(5,2),
  peso numeric(5,2),
  batimento integer,
  observacoes text,
  patologias text,
  medicamentos text,
  numero_federacao varchar(50),
  pmb varchar(50),
  data_inscricao date,
  atestado_medico boolean DEFAULT false,
  data_atestado date,
  informacoes_medicas text,
  arquivo_am_path varchar(500),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saude_atletas (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patologias text,
  medicamentos text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Treinos / Presencas (legacy and novo)
CREATE TABLE IF NOT EXISTS treinos (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  numero integer NOT NULL,
  data date NOT NULL,
  sessao varchar(100),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS presencas (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data date NOT NULL,
  numero_treino smallint NOT NULL,
  presenca boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- New presencas_novo table expected by the app (Drizzle schema)
CREATE TABLE IF NOT EXISTS presencas_novo (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data date NOT NULL,
  numero_treino integer NOT NULL,
  presenca boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_presencas_novo_user_id ON presencas_novo(user_id);

-- Resultados
CREATE TABLE IF NOT EXISTS resultados (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  epoca varchar(10),
  data date NOT NULL,
  escalao varchar(100),
  competicao varchar(200) NOT NULL,
  local varchar(200),
  piscina varchar(50),
  prova varchar(200) NOT NULL,
  tempo varchar(20),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Eventos & related
CREATE TABLE IF NOT EXISTS eventos_tipos (
  id bigserial PRIMARY KEY,
  nome varchar(100) NOT NULL,
  cor varchar(7),
  icon varchar(50),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS convocatorias (
  id bigserial PRIMARY KEY,
  titulo varchar(200) NOT NULL,
  data date NOT NULL,
  ficheiro_path varchar(500),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eventos (
  id bigserial PRIMARY KEY,
  titulo varchar(200) NOT NULL,
  descricao text,
  transporte boolean DEFAULT false,
  data_inicio date NOT NULL,
  data_fim date,
  local varchar(200),
  tipo_evento_id bigint REFERENCES eventos_tipos(id) ON DELETE SET NULL,
  visibilidade visibilidade DEFAULT 'privado',
  transporte_disponivel boolean DEFAULT false,
  local_partida varchar(200),
  hora_partida varchar(10),
  observacoes text,
  convocatoria_path varchar(500),
  regulamento_path varchar(500),
  convocatoria_id bigint REFERENCES convocatorias(id) ON DELETE SET NULL,
  tem_transporte boolean DEFAULT false,
  transporte_descricao text,
  regulamento_id bigint,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evento_escalao (
  id bigserial PRIMARY KEY,
  evento_id bigint NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  escalao_id bigint NOT NULL REFERENCES escaloes(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eventos_users (
  id bigserial PRIMARY KEY,
  evento_id bigint NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  convocado boolean DEFAULT false,
  presenca_confirmada boolean DEFAULT false,
  justificacao text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Financeiro (core)
CREATE TABLE IF NOT EXISTS tipos_mensalidade (
  id bigserial PRIMARY KEY,
  designacao varchar(200) NOT NULL,
  valor numeric(10,2) NOT NULL,
  descricao text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dados_financeiros (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  estado_pagamento varchar(50),
  numero_recibo varchar(100),
  referencia_pagamento varchar(100),
  mensalidade_id bigint REFERENCES tipos_mensalidade(id) ON DELETE SET NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faturas (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_fatura date NOT NULL,
  mes varchar(7) NOT NULL,
  mes_referencia varchar(7),
  data_emissao date,
  estado estado_fatura DEFAULT 'pendente',
  total numeric(12,2) DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Minimal index suggestions
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_treinos_user_id ON treinos(user_id);
CREATE INDEX IF NOT EXISTS idx_presencas_user_id ON presencas(user_id);

-- Notes:
-- 1) This SQL intentionally uses enums for a few columns; if you prefer simple text/varchar columns,
--    change "estado_utilizador estado_utilizador" to "varchar(...)" etc. Enums are created idempotently.
-- 2) If you already have tables with different shapes, run in a test environment first. ALTER statements
--    can be added to merge columns into existing tables; this file creates missing tables/columns only.
-- 3) After applying, consider running: SELECT setval(pg_get_serial_sequence('users','id'), coalesce(max(id),1)) FROM users;
--    for each bigserial table if you imported historic data and want sequences to reflect current max id.

-- End of schema
