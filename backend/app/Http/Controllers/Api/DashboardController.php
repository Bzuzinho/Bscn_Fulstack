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
        $totalAtletas = Pessoa::where('tipo', 'Atleta')->count();
        $atividadesMes = Atividade::whereMonth('data', now()->month)
                                    ->whereYear('data', now()->year)
                                    ->count();
        
        $receitaMensal = Fatura::where('estado', 'Paga')
                               ->whereMonth('data_emissao', now()->month)
                               ->whereYear('data_emissao', now()->year)
                               ->sum('valor_total');
        
        $taxaPresenca = 85.0;

        $stats = [
            'totalAtletas' => $totalAtletas,
            'atividadesMes' => $atividadesMes,
            'receitaMensal' => number_format($receitaMensal, 2, '.', ''),
            'taxaPresenca' => number_format($taxaPresenca, 1, '.', ''),
        ];

        return response()->json($stats);
    }
}
