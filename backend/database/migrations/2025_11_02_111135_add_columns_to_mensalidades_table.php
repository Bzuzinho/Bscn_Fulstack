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
        Schema::table('mensalidades', function (Blueprint $table) {
            $table->integer('pessoa_id');
            $table->date('mes_referencia');
            $table->decimal('valor', 10, 2);
            $table->string('estado');
            $table->integer('tipo_mensalidade_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('mensalidades', function (Blueprint $table) {
            $table->dropColumn([
                'pessoa_id', 'mes_referencia', 'valor', 'estado', 'tipo_mensalidade_id'
            ]);
        });
    }
};
