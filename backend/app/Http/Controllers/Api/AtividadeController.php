<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atividade;
use Illuminate\Http\Request;

class AtividadeController extends Controller
{
    public function index(Request $request)
    {
        $query = Atividade::query();
        
        if ($request->has('escalao')) {
            $query->where('escalao', $request->escalao);
        }
        
        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }
        
        $atividades = $query->orderBy('data', 'desc')->get();
        return response()->json($atividades);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'tipo' => 'required|in:Treino,Jogo,Evento,Outro',
            'data' => 'required|date',
            'hora_inicio' => 'nullable|string',
            'hora_fim' => 'nullable|string',
            'local' => 'nullable|string|max:255',
            'escalao' => 'nullable|integer|exists:escaloes,id',
            'descricao' => 'nullable|string',
        ]);

        $atividade = Atividade::create($validated);
        return response()->json($atividade, 201);
    }

    public function show($id)
    {
        $atividade = Atividade::findOrFail($id);
        return response()->json($atividade);
    }

    public function update(Request $request, $id)
    {
        $atividade = Atividade::findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|in:Treino,Jogo,Evento,Outro',
            'data' => 'sometimes|date',
            'hora_inicio' => 'nullable|string',
            'hora_fim' => 'nullable|string',
            'local' => 'nullable|string|max:255',
            'escalao' => 'nullable|integer|exists:escaloes,id',
            'descricao' => 'nullable|string',
        ]);

        $atividade->update($validated);
        return response()->json($atividade);
    }

    public function destroy($id)
    {
        $atividade = Atividade::findOrFail($id);
        $atividade->delete();
        return response()->json(null, 204);
    }
}
