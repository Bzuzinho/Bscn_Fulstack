<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        $email = $request->header('X-Replit-User-Email') ?? 'admin@benedita.pt';
        $name = $request->header('X-Replit-User-Name') ?? 'Admin Benedita';
        
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password123'),
            ]
        );

        return response()->json($user);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password ?? '')) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['user' => $user, 'message' => 'Login successful']);
    }

    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logout successful']);
    }
}
