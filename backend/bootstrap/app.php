<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Globální odchytávání odpovědí pro požadavky z prohlížeče (ne-JSON)
        $exceptions->respond(function ($response, $e, $request) {
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));

            if (!$request->expectsJson()) {
                if ($response->getStatusCode() === 401) {
                    return redirect($frontendUrl . '/prihlaseni');
                }

                if ($response->getStatusCode() === 403) {
                    return redirect($frontendUrl . '/overeni-emailu?verify=false');
                }
            }

            return $response;
        });
    })
    ->create();
