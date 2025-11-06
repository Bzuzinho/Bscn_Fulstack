<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        // Prefer session-based authentication (Auth::user()). If a session
        // exists return the authenticated user. Otherwise, fall back to the
        // Replit headers auto-dev-user behavior (for Replit dev environment).
        $authUser = Auth::user();
        if ($authUser) {
            return response()->json($authUser);
        }

        $emailHeader = $request->header('X-Replit-User-Email');
        $nameHeader = $request->header('X-Replit-User-Name');

        if (!$emailHeader) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $email = $emailHeader;
        $name = $nameHeader ?? 'Admin Benedita';

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

        // Log the user in via Laravel's auth system so a session cookie is set.
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user, 'message' => 'Login successful']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful']);
    }
}
