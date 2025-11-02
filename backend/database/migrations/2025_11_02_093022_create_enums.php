<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create PostgreSQL enums (drop if exists first)
        DB::statement("DROP TYPE IF EXISTS estado_utilizador CASCADE");
        DB::statement("CREATE TYPE estado_utilizador AS ENUM ('ativo', 'inativo', 'suspenso')");
        
        DB::statement("DROP TYPE IF EXISTS sexo CASCADE");
        DB::statement("CREATE TYPE sexo AS ENUM ('M', 'F', 'Outro')");
        
        DB::statement("DROP TYPE IF EXISTS estado_civil CASCADE");
        DB::statement("CREATE TYPE estado_civil AS ENUM ('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_facto')");
        
        DB::statement("DROP TYPE IF EXISTS visibilidade CASCADE");
        DB::statement("CREATE TYPE visibilidade AS ENUM ('privado', 'restrito', 'publico')");
        
        DB::statement("DROP TYPE IF EXISTS estado_fatura CASCADE");
        DB::statement("CREATE TYPE estado_fatura AS ENUM ('futuro', 'pendente', 'em_divida', 'paga', 'cancelada')");
        
        DB::statement("DROP TYPE IF EXISTS tipo_centro_custo CASCADE");
        DB::statement("CREATE TYPE tipo_centro_custo AS ENUM ('escalao', 'departamento', 'clube_generico')");
        
        DB::statement("DROP TYPE IF EXISTS tipo_lancamento CASCADE");
        DB::statement("CREATE TYPE tipo_lancamento AS ENUM ('receita', 'despesa')");
        
        DB::statement("DROP TYPE IF EXISTS status_conciliacao CASCADE");
        DB::statement("CREATE TYPE status_conciliacao AS ENUM ('sugerido', 'confirmado', 'rejeitado')");
        
        DB::statement("DROP TYPE IF EXISTS tipo_patrocinio CASCADE");
        DB::statement("CREATE TYPE tipo_patrocinio AS ENUM ('anual', 'pontual')");
        
        DB::statement("DROP TYPE IF EXISTS estado_patrocinio CASCADE");
        DB::statement("CREATE TYPE estado_patrocinio AS ENUM ('ativo', 'suspenso', 'terminado')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP TYPE IF EXISTS estado_patrocinio");
        DB::statement("DROP TYPE IF EXISTS tipo_patrocinio");
        DB::statement("DROP TYPE IF EXISTS status_conciliacao");
        DB::statement("DROP TYPE IF EXISTS tipo_lancamento");
        DB::statement("DROP TYPE IF EXISTS tipo_centro_custo");
        DB::statement("DROP TYPE IF EXISTS estado_fatura");
        DB::statement("DROP TYPE IF EXISTS visibilidade");
        DB::statement("DROP TYPE IF EXISTS estado_civil");
        DB::statement("DROP TYPE IF EXISTS sexo");
        DB::statement("DROP TYPE IF EXISTS estado_utilizador");
    }
};
