<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fatura;
use App\Models\TipoMensalidade;
use App\Models\CentroCusto;
use Illuminate\Http\Request;

class FaturaController extends Controller
{
    public function index(Request $request)
    {
        $query = Fatura::query();
        
        if ($request->has('pessoa_id')) {
            $query->where('pessoa_id', $request->pessoa_id);
        }
        
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }
        
        $faturas = $query->orderBy('data_emissao', 'desc')->get();
        return response()->json($faturas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:faturas',
            'pessoa_id' => 'required|integer|exists:pessoas,id',
            'data_emissao' => 'required|date',
            'data_vencimento' => 'required|date',
            'valor_total' => 'required|numeric|min:0',
            'estado' => 'required|in:Pendente,Paga,Cancelada',
            'descricao' => 'nullable|string',
        ]);

        $fatura = Fatura::create($validated);
        return response()->json($fatura, 201);
    }

    public function show($id)
    {
        $fatura = Fatura::findOrFail($id);
        return response()->json($fatura);
    }

    public function update(Request $request, $id)
    {
        $fatura = Fatura::findOrFail($id);
        
        $validated = $request->validate([
            'numero' => 'sometimes|string|unique:faturas,numero,' . $id,
            'pessoa_id' => 'sometimes|integer|exists:pessoas,id',
            'data_emissao' => 'sometimes|date',
            'data_vencimento' => 'sometimes|date',
            'valor_total' => 'sometimes|numeric|min:0',
            'estado' => 'sometimes|in:Pendente,Paga,Cancelada',
            'descricao' => 'nullable|string',
        ]);

        $fatura->update($validated);
        return response()->json($fatura);
    }

    public function destroy($id)
    {
        $fatura = Fatura::findOrFail($id);
        $fatura->delete();
        return response()->json(null, 204);
    }

    public function gerarAnuais(Request $request)
    {
        return response()->json(['message' => 'Geração de faturas anuais não implementada'], 501);
    }

    public function marcarPaga($id)
    {
        $fatura = Fatura::findOrFail($id);
        $fatura->update(['estado' => 'Paga']);
        return response()->json($fatura);
    }

    public function tiposMensalidade()
    {
        $tipos = TipoMensalidade::orderBy('nome')->get();
        return response()->json($tipos);
    }

    public function createTipoMensalidade(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
        ]);

        $tipo = TipoMensalidade::create($validated);
        return response()->json($tipo, 201);
    }

    public function centrosCusto()
    {
        $centros = CentroCusto::orderBy('nome')->get();
        return response()->json($centros);
    }

    public function createCentroCusto(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'codigo' => 'required|string|max:50|unique:centros_custo',
        ]);

        $centro = CentroCusto::create($validated);
        return response()->json($centro, 201);
    }
}
