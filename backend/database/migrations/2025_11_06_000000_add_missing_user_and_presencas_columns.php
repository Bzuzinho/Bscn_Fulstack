<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        // Create enum types if they do not exist
        DB::statement(<<<'SQL'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_utilizador') THEN
        CREATE TYPE estado_utilizador AS ENUM ('ativo', 'inativo', 'suspenso');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo') THEN
        CREATE TYPE sexo AS ENUM ('M', 'F', 'Outro');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_civil') THEN
        CREATE TYPE estado_civil AS ENUM ('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto');
    END IF;
END$$;
SQL
        );

        // Add columns to users table if missing
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'profile_image_url')) {
                $table->string('profile_image_url')->nullable();
            }
            if (!Schema::hasColumn('users', 'numero_socio')) {
                $table->string('numero_socio', 50)->nullable();
            }
            if (!Schema::hasColumn('users', 'estado')) {
                $table->string('estado', 50)->nullable();
            }
            // enum columns (created below via raw ALTER TABLE because Blueprint doesn't
            // support custom enum types directly)
            if (!Schema::hasColumn('users', 'nif')) {
                $table->string('nif', 20)->nullable();
            }
            if (!Schema::hasColumn('users', 'cartao_cidadao')) {
                $table->string('cartao_cidadao', 20)->nullable();
            }
            if (!Schema::hasColumn('users', 'contacto')) {
                $table->string('contacto', 20)->nullable();
            }
            if (!Schema::hasColumn('users', 'data_nascimento')) {
                $table->date('data_nascimento')->nullable();
            }
            // enum columns (created below via raw ALTER TABLE)
            if (!Schema::hasColumn('users', 'morada')) {
                $table->text('morada')->nullable();
            }
            if (!Schema::hasColumn('users', 'codigo_postal')) {
                $table->string('codigo_postal', 10)->nullable();
            }
            if (!Schema::hasColumn('users', 'localidade')) {
                $table->string('localidade', 100)->nullable();
            }
            if (!Schema::hasColumn('users', 'empresa')) {
                $table->string('empresa', 200)->nullable();
            }
            if (!Schema::hasColumn('users', 'escola')) {
                $table->string('escola', 200)->nullable();
            }
            // enum columns (created below via raw ALTER TABLE)
            if (!Schema::hasColumn('users', 'ocupacao')) {
                $table->string('ocupacao', 100)->nullable();
            }
            if (!Schema::hasColumn('users', 'nacionalidade')) {
                $table->string('nacionalidade', 50)->nullable();
            }
            if (!Schema::hasColumn('users', 'numero_irmaos')) {
                $table->integer('numero_irmaos')->nullable();
            }
            if (!Schema::hasColumn('users', 'menor')) {
                $table->boolean('menor')->default(false);
            }
            if (!Schema::hasColumn('users', 'encarregado_id')) {
                $table->unsignedBigInteger('encarregado_id')->nullable()->index();
            }
            if (!Schema::hasColumn('users', 'escalao_id')) {
                $table->unsignedBigInteger('escalao_id')->nullable()->index();
            }
            if (!Schema::hasColumn('users', 'tipo_mensalidade_id')) {
                $table->unsignedBigInteger('tipo_mensalidade_id')->nullable()->index();
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role', 50)->default('membro');
            }
            if (!Schema::hasColumn('users', 'profile_photo_path')) {
                $table->string('profile_photo_path', 500)->nullable();
            }
            if (!Schema::hasColumn('users', 'observacoes_config')) {
                $table->text('observacoes_config')->nullable();
            }
        });

        // Add enum-typed columns via raw ALTER TABLE if they don't exist
        if (!Schema::hasColumn('users', 'estado_utilizador')) {
            DB::statement("ALTER TABLE users ADD COLUMN estado_utilizador estado_utilizador NULL");
        }
        if (!Schema::hasColumn('users', 'sexo')) {
            DB::statement("ALTER TABLE users ADD COLUMN sexo sexo NULL");
        }
        if (!Schema::hasColumn('users', 'estado_civil')) {
            DB::statement("ALTER TABLE users ADD COLUMN estado_civil estado_civil NULL");
        }

        // Add columns to presencas_novo table
        if (Schema::hasTable('presencas_novo')) {
            Schema::table('presencas_novo', function (Blueprint $table) {
                if (!Schema::hasColumn('presencas_novo', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->index();
                }
                if (!Schema::hasColumn('presencas_novo', 'data')) {
                    $table->date('data')->nullable();
                }
                if (!Schema::hasColumn('presencas_novo', 'numero_treino')) {
                    $table->integer('numero_treino')->nullable();
                }
                if (!Schema::hasColumn('presencas_novo', 'presenca')) {
                    $table->boolean('presenca')->default(false);
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $cols = [
                'first_name','last_name','profile_image_url','numero_socio','estado','estado_utilizador',
                'nif','cartao_cidadao','contacto','data_nascimento','sexo','morada','codigo_postal','localidade',
                'empresa','escola','estado_civil','ocupacao','nacionalidade','numero_irmaos','menor',
                'encarregado_id','escalao_id','tipo_mensalidade_id','role','profile_photo_path','observacoes_config'
            ];
            foreach ($cols as $c) {
                if (Schema::hasColumn('users', $c)) {
                    $table->dropColumn($c);
                }
            }
        });

        if (Schema::hasTable('presencas_novo')) {
            Schema::table('presencas_novo', function (Blueprint $table) {
                foreach (['user_id','data','numero_treino','presenca'] as $c) {
                    if (Schema::hasColumn('presencas_novo', $c)) {
                        $table->dropColumn($c);
                    }
                }
            });
        }

        // Note: enums are left in place to avoid accidental removal if shared by other tables.
    }
};
