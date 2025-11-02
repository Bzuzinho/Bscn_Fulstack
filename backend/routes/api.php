<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EscalaoController;
use App\Http\Controllers\Api\PessoaController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AtividadeController;
use App\Http\Controllers\Api\PresencaController;
use App\Http\Controllers\Api\MensalidadeController;
use App\Http\Controllers\Api\FaturaController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'time' => now()]));

// Auth routes
Route::prefix('auth')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Escaloes routes
Route::apiResource('escaloes', EscalaoController::class);

// Pessoas routes
Route::apiResource('pessoas', PessoaController::class);

// Users routes
Route::apiResource('users', UserController::class);
Route::get('/users/{id}/dados-desportivos', [UserController::class, 'dadosDesportivos']);
Route::put('/users/{id}/dados-desportivos', [UserController::class, 'updateDadosDesportivos']);
Route::get('/users/{id}/dados-configuracao', [UserController::class, 'dadosConfiguracao']);
Route::put('/users/{id}/dados-configuracao', [UserController::class, 'updateDadosConfiguracao']);
Route::get('/users/{id}/treinos', [UserController::class, 'treinos']);
Route::get('/users/{id}/resultados', [UserController::class, 'resultados']);

// Atividades routes
Route::apiResource('atividades', AtividadeController::class);

// Presencas routes
Route::apiResource('presencas', PresencaController::class);

// Mensalidades routes
Route::apiResource('mensalidades', MensalidadeController::class);
Route::get('/mensalidades/stats', [MensalidadeController::class, 'stats']);

// Faturas routes
Route::apiResource('faturas', FaturaController::class);
Route::post('/faturas/gerar-anuais', [FaturaController::class, 'gerarAnuais']);
Route::put('/faturas/{id}/pagar', [FaturaController::class, 'marcarPaga']);

// Tipos de Mensalidade
Route::get('/tipos-mensalidade', [FaturaController::class, 'tiposMensalidade']);
Route::post('/tipos-mensalidade', [FaturaController::class, 'createTipoMensalidade']);

// Centros de Custo
Route::get('/centros-custo', [FaturaController::class, 'centrosCusto']);
Route::post('/centros-custo', [FaturaController::class, 'createCentroCusto']);

// Dashboard stats
Route::get('/stats', [DashboardController::class, 'index']);

// Object storage (profile images)
Route::put('/profile-images', [UserController::class, 'uploadProfileImage']);
