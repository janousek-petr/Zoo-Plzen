<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Autentizace
Route::post('/register', RegisteredUserController::class.'@store')->middleware('guest:sanctum');
Route::post('/logout', AuthenticatedSessionController::class.'@destroy')->middleware('auth:sanctum');
Route::post('/login', AuthenticatedSessionController::class.'@store')->middleware('guest:sanctum');
