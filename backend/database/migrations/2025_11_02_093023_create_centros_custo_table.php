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
        Schema::create('centros_custo', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 200)->nullable(false);
            $table->string('referencia_externa', 100)->nullable();
            $table->unsignedBigInteger('escalao_id')->nullable();
            $table->boolean('ativo')->default(true);
            $table->decimal('percentagem_distribuicao', 5, 2)->nullable();
            $table->timestamps();
        });
        
        // Add enum column after table creation
        DB::statement('ALTER TABLE centros_custo ADD COLUMN tipo tipo_centro_custo NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('centros_custo');
    }
};
