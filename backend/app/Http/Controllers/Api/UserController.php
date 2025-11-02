<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DadosDesportivos;
use App\Models\DadosConfiguracao;
use App\Models\Treino;
use App\Models\Resultado;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }

    public function dadosDesportivos($id)
    {
        $dados = DadosDesportivos::where('user_id', $id)->first();
        return response()->json($dados);
    }

    public function updateDadosDesportivos(Request $request, $id)
    {
        $validated = $request->validate([
            'modalidade' => 'nullable|string',
            'posicao' => 'nullable|string',
            'nivel_competitivo' => 'nullable|string',
        ]);

        $dados = DadosDesportivos::updateOrCreate(
            ['user_id' => $id],
            $validated
        );

        return response()->json($dados);
    }

    public function dadosConfiguracao($id)
    {
        $dados = DadosConfiguracao::where('user_id', $id)->first();
        return response()->json($dados);
    }

    public function updateDadosConfiguracao(Request $request, $id)
    {
        $validated = $request->validate([
            'tema' => 'nullable|string',
            'idioma' => 'nullable|string',
            'notificacoes' => 'nullable|boolean',
        ]);

        $dados = DadosConfiguracao::updateOrCreate(
            ['user_id' => $id],
            $validated
        );

        return response()->json($dados);
    }

    public function treinos($id)
    {
        $treinos = Treino::where('user_id', $id)->orderBy('data', 'desc')->get();
        return response()->json($treinos);
    }

    public function resultados($id)
    {
        $resultados = Resultado::where('user_id', $id)->orderBy('data', 'desc')->get();
        return response()->json($resultados);
    }

    public function uploadProfileImage(Request $request)
    {
        return response()->json(['message' => 'Profile image upload not yet implemented'], 501);
    }
}
