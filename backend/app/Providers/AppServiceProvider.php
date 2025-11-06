<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // In development we want to allow JSON session login from the
        // front-end dev server. Add the auth endpoints to the global
        // VerifyCsrfToken exception list so the middleware will skip them.
        VerifyCsrfToken::except([
            'login',
            'logout',
            'user',
            'auth/login',
            'auth/logout',
            'auth/user',
            'api/login',
            'api/logout',
            'api/user',
            'api/auth/login',
            'api/auth/logout',
            'api/auth/user',
        ]);
    }
}
