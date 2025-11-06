<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * We exclude the API-compatible auth endpoints because the frontend
     * sends JSON requests from the dev server and we use session-based
     * authentication for those routes in development.
     *
     * @var array<int, string>
     */
    protected $except = [
        'login',
        'logout',
        'user',
        'auth/login',
        'auth/logout',
        'auth/user',
        // when routes are mounted under the /api prefix (this project uses
        // api routes but we run auth under the web middleware for sessions)
        'api/login',
        'api/logout',
        'api/user',
        'api/auth/login',
        'api/auth/logout',
        'api/auth/user',
    ];
}
