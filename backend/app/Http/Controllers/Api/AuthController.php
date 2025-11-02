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
        $userId = $request->header('X-Replit-User-Id') ?? 'test-user-id';
        
        $user = User::firstOrCreate(
            ['id' => $userId],
            [
                'email' => $request->header('X-Replit-User-Email') ?? 'test@example.com',
                'first_name' => $request->header('X-Replit-User-Name') ?? 'Test',
                'last_name' => 'User',
                'name' => $request->header('X-Replit-User-Name') ?? 'Test User',
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
