<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('escaloes', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100)->nullable(false)->unique();
            $table->text('descricao')->nullable();
            $table->unsignedBigInteger('centro_custo_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escaloes');
    }
};
