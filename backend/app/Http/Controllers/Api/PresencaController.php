<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presenca;
use Illuminate\Http\Request;

class PresencaController extends Controller
{
    public function index(Request $request)
    {
        $query = Presenca::query();
        
        if ($request->has('atividade_id')) {
            $query->where('atividade_id', $request->atividade_id);
        }
        
        if ($request->has('pessoa_id')) {
            $query->where('pessoa_id', $request->pessoa_id);
        }
        
        $presencas = $query->orderBy('created_at', 'desc')->get();
        return response()->json($presencas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'atividade_id' => 'required|integer|exists:atividades,id',
            'pessoa_id' => 'required|integer|exists:pessoas,id',
            'presente' => 'required|boolean',
            'justificacao' => 'nullable|string',
        ]);

        $presenca = Presenca::create($validated);
        return response()->json($presenca, 201);
    }

    public function show($id)
    {
        $presenca = Presenca::findOrFail($id);
        return response()->json($presenca);
    }

    public function update(Request $request, $id)
    {
        $presenca = Presenca::findOrFail($id);
        
        $validated = $request->validate([
            'atividade_id' => 'sometimes|integer|exists:atividades,id',
            'pessoa_id' => 'sometimes|integer|exists:pessoas,id',
            'presente' => 'sometimes|boolean',
            'justificacao' => 'nullable|string',
        ]);

        $presenca->update($validated);
        return response()->json($presenca);
    }

    public function destroy($id)
    {
        $presenca = Presenca::findOrFail($id);
        $presenca->delete();
        return response()->json(null, 204);
    }
}
