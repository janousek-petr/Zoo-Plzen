<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\RegionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Autentizace
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest:sanctum');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest:sanctum');

// Kvíz (apiResource = GET, POST, GET, PUT, DELETE v jednom)
Route::apiResource('quizzes', QuizController::class);
Route::get('/quizzes/{id}/questions', [QuizController::class, 'questions']);

// Otázky
//Route::get('/quiz/{id}', [QuizController::class, 'show'])->middleware('guest:sanctum');

Route::get('/regions/{id}/quizzes', [QuizController::class, 'byRegion']);

Route::get('/regions', [RegionController::class, 'index']);
