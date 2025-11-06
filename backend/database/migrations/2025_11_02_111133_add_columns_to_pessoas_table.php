<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Disable automatic transaction wrapping for this migration.
     */
    public $withinTransaction = false;
    public function up(): void
    {
        Schema::table('pessoas', function (Blueprint $table) {
            $table->string('nome');
            $table->string('tipo');
            $table->integer('escalao')->nullable();
            $table->string('nif', 9)->nullable();
            $table->date('data_nascimento')->nullable();
            $table->string('genero', 1)->nullable();
            $table->text('morada')->nullable();
            $table->string('codigo_postal', 8)->nullable();
            $table->string('localidade')->nullable();
            $table->string('telefone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('cc', 20)->nullable();
            $table->date('validade_cc')->nullable();
            $table->string('iban', 34)->nullable();
            $table->string('nr_utente', 50)->nullable();
            $table->string('nome_enc_educacao')->nullable();
            $table->string('telefone_enc_educacao', 20)->nullable();
            $table->string('email_enc_educacao')->nullable();
            $table->text('observacoes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pessoas', function (Blueprint $table) {
            $table->dropColumn([
                'nome', 'tipo', 'escalao', 'nif', 'data_nascimento', 'genero',
                'morada', 'codigo_postal', 'localidade', 'telefone', 'email',
                'cc', 'validade_cc', 'iban', 'nr_utente',
                'nome_enc_educacao', 'telefone_enc_educacao', 'email_enc_educacao',
                'observacoes'
            ]);
        });
    }
};
