<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pessoa;
use Illuminate\Http\Request;

class PessoaController extends Controller
{
    public function index(Request $request)
    {
        $query = Pessoa::query();
        
        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }
        
        if ($request->has('escalao')) {
            $query->where('escalao', $request->escalao);
        }
        
        $pessoas = $query->orderBy('nome')->get();
        return response()->json($pessoas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'tipo' => 'required|in:Atleta,Treinador,Diretor,Outro',
            'escalao' => 'nullable|integer|exists:escaloes,id',
            'nif' => 'nullable|string|max:9',
            'data_nascimento' => 'nullable|date',
            'genero' => 'nullable|in:M,F',
            'morada' => 'nullable|string',
            'codigo_postal' => 'nullable|string|max:8',
            'localidade' => 'nullable|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cc' => 'nullable|string|max:20',
            'validade_cc' => 'nullable|date',
            'iban' => 'nullable|string|max:34',
            'nr_utente' => 'nullable|string|max:50',
            'nome_enc_educacao' => 'nullable|string|max:255',
            'telefone_enc_educacao' => 'nullable|string|max:20',
            'email_enc_educacao' => 'nullable|email|max:255',
            'observacoes' => 'nullable|string',
        ]);

        $pessoa = Pessoa::create($validated);
        return response()->json($pessoa, 201);
    }

    public function show($id)
    {
        $pessoa = Pessoa::findOrFail($id);
        return response()->json($pessoa);
    }

    public function update(Request $request, $id)
    {
        $pessoa = Pessoa::findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|in:Atleta,Treinador,Diretor,Outro',
            'escalao' => 'nullable|integer|exists:escaloes,id',
            'nif' => 'nullable|string|max:9',
            'data_nascimento' => 'nullable|date',
            'genero' => 'nullable|in:M,F',
            'morada' => 'nullable|string',
            'codigo_postal' => 'nullable|string|max:8',
            'localidade' => 'nullable|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cc' => 'nullable|string|max:20',
            'validade_cc' => 'nullable|date',
            'iban' => 'nullable|string|max:34',
            'nr_utente' => 'nullable|string|max:50',
            'nome_enc_educacao' => 'nullable|string|max:255',
            'telefone_enc_educacao' => 'nullable|string|max:20',
            'email_enc_educacao' => 'nullable|email|max:255',
            'observacoes' => 'nullable|string',
        ]);

        $pessoa->update($validated);
        return response()->json($pessoa);
    }

    public function destroy($id)
    {
        $pessoa = Pessoa::findOrFail($id);
        $pessoa->delete();
        return response()->json(null, 204);
    }
}
