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
        Schema::table('financeiro_tables', function (Blueprint $table) {
            $table->string('numero')->unique();
            $table->integer('pessoa_id');
            $table->date('data_emissao');
            $table->date('data_vencimento');
            $table->decimal('valor_total', 10, 2);
            $table->string('estado');
            $table->text('descricao')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('financeiro_tables', function (Blueprint $table) {
            $table->dropColumn([
                'numero', 'pessoa_id', 'data_emissao', 'data_vencimento',
                'valor_total', 'estado', 'descricao'
            ]);
        });
    }
};
