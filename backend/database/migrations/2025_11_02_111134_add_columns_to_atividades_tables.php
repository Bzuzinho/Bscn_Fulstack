<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('atividades_tables', function (Blueprint $table) {
            $table->string('nome');
            $table->string('tipo');
            $table->date('data');
            $table->string('hora_inicio')->nullable();
            $table->string('hora_fim')->nullable();
            $table->string('local')->nullable();
            $table->integer('escalao')->nullable();
            $table->text('descricao')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('atividades_tables', function (Blueprint $table) {
            $table->dropColumn([
                'nome', 'tipo', 'data', 'hora_inicio', 'hora_fim',
                'local', 'escalao', 'descricao'
            ]);
        });
    }
};
