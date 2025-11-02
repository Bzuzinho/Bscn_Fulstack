<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Escalao;
use Illuminate\Http\Request;

class EscalaoController extends Controller
{
    public function index()
    {
        $escaloes = Escalao::orderBy('nome')->get();
        return response()->json($escaloes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'idade_minima' => 'nullable|integer',
            'idade_maxima' => 'nullable|integer',
            'genero' => 'nullable|in:M,F,Misto',
        ]);

        $escalao = Escalao::create($validated);
        return response()->json($escalao, 201);
    }

    public function show($id)
    {
        $escalao = Escalao::findOrFail($id);
        return response()->json($escalao);
    }

    public function update(Request $request, $id)
    {
        $escalao = Escalao::findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'idade_minima' => 'nullable|integer',
            'idade_maxima' => 'nullable|integer',
            'genero' => 'nullable|in:M,F,Misto',
        ]);

        $escalao->update($validated);
        return response()->json($escalao);
    }

    public function destroy($id)
    {
        $escalao = Escalao::findOrFail($id);
        $escalao->delete();
        return response()->json(null, 204);
    }
}
