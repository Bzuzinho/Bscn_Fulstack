-- add_missing_columns.sql
-- Criado: 2025-11-06
-- Adiciona enums e colunas ausentes esperadas pelo código (são todas NULLABLE / seguras).

-- 1) Criar tipos enum se não existirem
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_utilizador') THEN
    CREATE TYPE estado_utilizador AS ENUM ('ativo','inativo','suspenso');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo') THEN
    CREATE TYPE sexo AS ENUM ('M','F','Outro');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_civil') THEN
    CREATE TYPE estado_civil AS ENUM ('solteiro','casado','divorciado','viuvo','uniao_facto');
  END IF;
END
$$;

-- 2) Adicionar colunas à tabela `users` (IF NOT EXISTS)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS first_name varchar(255),
  ADD COLUMN IF NOT EXISTS last_name varchar(255),
  ADD COLUMN IF NOT EXISTS profile_image_url varchar(500),
  ADD COLUMN IF NOT EXISTS numero_socio varchar(50),
  ADD COLUMN IF NOT EXISTS estado varchar(50),
  ADD COLUMN IF NOT EXISTS estado_utilizador estado_utilizador,
  ADD COLUMN IF NOT EXISTS nif varchar(20),
  ADD COLUMN IF NOT EXISTS cartao_cidadao varchar(20),
  ADD COLUMN IF NOT EXISTS contacto varchar(20),
  ADD COLUMN IF NOT EXISTS data_nascimento date,
  ADD COLUMN IF NOT EXISTS sexo sexo,
  ADD COLUMN IF NOT EXISTS morada text,
  ADD COLUMN IF NOT EXISTS codigo_postal varchar(10),
  ADD COLUMN IF NOT EXISTS localidade varchar(100),
  ADD COLUMN IF NOT EXISTS empresa varchar(200),
  ADD COLUMN IF NOT EXISTS escola varchar(200),
  ADD COLUMN IF NOT EXISTS estado_civil estado_civil,
  ADD COLUMN IF NOT EXISTS ocupacao varchar(100),
  ADD COLUMN IF NOT EXISTS nacionalidade varchar(50),
  ADD COLUMN IF NOT EXISTS numero_irmaos integer,
  ADD COLUMN IF NOT EXISTS menor boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS encarregado_id bigint,
  ADD COLUMN IF NOT EXISTS escalao_id bigint,
  ADD COLUMN IF NOT EXISTS tipo_mensalidade_id bigint,
  ADD COLUMN IF NOT EXISTS role varchar(50) DEFAULT 'membro',
  ADD COLUMN IF NOT EXISTS profile_photo_path varchar(500),
  ADD COLUMN IF NOT EXISTS observacoes_config text;

-- 3) Adicionar colunas à tabela `presencas_novo` (IF NOT EXISTS)
ALTER TABLE presencas_novo
  ADD COLUMN IF NOT EXISTS user_id bigint,
  ADD COLUMN IF NOT EXISTS data date,
  ADD COLUMN IF NOT EXISTS numero_treino integer,
  ADD COLUMN IF NOT EXISTS presenca boolean DEFAULT false;

-- 4) Índices convenientes (cria se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_encarregado_id ON users(encarregado_id);
CREATE INDEX IF NOT EXISTS idx_users_escalao_id ON users(escalao_id);
CREATE INDEX IF NOT EXISTS idx_users_tipo_mensalidade_id ON users(tipo_mensalidade_id);
CREATE INDEX IF NOT EXISTS idx_presencas_novo_user_id ON presencas_novo(user_id);

-- Observação: não foram adicionadas FOREIGN KEYS automaticamente para evitar erros
-- se as tabelas referenciadas não existirem ainda. Se quiseres que eu adicione as
-- constraints (por ex. encarregado_id -> users(id)), posso preparar um bloco adicional
-- com checagem e adicionar as constraints de forma segura.