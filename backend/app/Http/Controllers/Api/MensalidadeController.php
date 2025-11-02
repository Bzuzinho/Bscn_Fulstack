<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mensalidade;
use Illuminate\Http\Request;

class MensalidadeController extends Controller
{
    public function index(Request $request)
    {
        $query = Mensalidade::query();
        
        if ($request->has('pessoa_id')) {
            $query->where('pessoa_id', $request->pessoa_id);
        }
        
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }
        
        $mensalidades = $query->orderBy('mes_referencia', 'desc')->get();
        return response()->json($mensalidades);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pessoa_id' => 'required|integer|exists:pessoas,id',
            'mes_referencia' => 'required|date',
            'valor' => 'required|numeric|min:0',
            'estado' => 'required|in:Pendente,Paga,Cancelada',
            'tipo_mensalidade_id' => 'nullable|integer|exists:tipos_mensalidade,id',
        ]);

        $mensalidade = Mensalidade::create($validated);
        return response()->json($mensalidade, 201);
    }

    public function show($id)
    {
        $mensalidade = Mensalidade::findOrFail($id);
        return response()->json($mensalidade);
    }

    public function update(Request $request, $id)
    {
        $mensalidade = Mensalidade::findOrFail($id);
        
        $validated = $request->validate([
            'pessoa_id' => 'sometimes|integer|exists:pessoas,id',
            'mes_referencia' => 'sometimes|date',
            'valor' => 'sometimes|numeric|min:0',
            'estado' => 'sometimes|in:Pendente,Paga,Cancelada',
            'tipo_mensalidade_id' => 'nullable|integer|exists:tipos_mensalidade,id',
        ]);

        $mensalidade->update($validated);
        return response()->json($mensalidade);
    }

    public function destroy($id)
    {
        $mensalidade = Mensalidade::findOrFail($id);
        $mensalidade->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        $stats = [
            'total' => Mensalidade::count(),
            'pagas' => Mensalidade::where('estado', 'Paga')->count(),
            'pendentes' => Mensalidade::where('estado', 'Pendente')->count(),
            'valor_total' => Mensalidade::sum('valor'),
            'valor_pago' => Mensalidade::where('estado', 'Paga')->sum('valor'),
        ];

        return response()->json($stats);
    }
}
