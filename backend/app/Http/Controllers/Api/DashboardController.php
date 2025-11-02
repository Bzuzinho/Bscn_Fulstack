<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pessoa;
use App\Models\Escalao;
use App\Models\Fatura;
use App\Models\Atividade;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_pessoas' => Pessoa::count(),
            'total_atletas' => Pessoa::where('tipo', 'Atleta')->count(),
            'total_treinadores' => Pessoa::where('tipo', 'Treinador')->count(),
            'total_escaloes' => Escalao::count(),
            'total_faturas' => Fatura::count(),
            'faturas_pendentes' => Fatura::where('estado', 'Pendente')->count(),
            'valor_faturas_pendentes' => Fatura::where('estado', 'Pendente')->sum('valor_total'),
            'total_atividades' => Atividade::count(),
            'atividades_mes' => Atividade::whereMonth('data', now()->month)->count(),
        ];

        return response()->json($stats);
    }
}
