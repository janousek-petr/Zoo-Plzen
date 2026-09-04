<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

// Obnovení hesla uživatele v adminu
Route::post('/admin/users/{id}/send-reset-password', function ($id) {
    $user = User::findOrFail($id);
    $status = Password::sendResetLink(['email' => $user->email]);

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'Odkaz byl odeslán.']);
    }

    return response()->json(['message' => 'E-mail se nepodařilo odeslat.'], 400);
});

// Kontrola tokenu na obnovení hesla
Route::post('/check-reset-token', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'token' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    // Kontrola: Zda uživatel existuje a zda token patří jemu a nevypršel
    if (! $user || ! Password::getRepository()->exists($user, $request->token)) {
        return response()->json([
            'valid' => false,
            'message' => 'Odkaz pro obnovení hesla je neplatný, již vypršel nebo nepatří k tomuto účtu.',
        ], 422);
    }

    return response()->json(['valid' => true]);
});

Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
