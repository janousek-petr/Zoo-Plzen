<?php

use App\Http\Controllers\AnsweredQuizzesController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\StoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Autentizace
Route::post('/register', RegisteredUserController::class.'@store')->middleware('guest:sanctum');
Route::post('/logout', AuthenticatedSessionController::class.'@destroy')->middleware('auth:sanctum');
Route::post('/login', AuthenticatedSessionController::class.'@store')->middleware('guest:sanctum');

// Kvíz
Route::get('/quizInfo', QuizController::class.'@index')->middleware('guest:sanctum');

//Otázky
Route::get('/quiz/{id}', QuizController::class.'@show')->middleware('guest:sanctum');

//Vyřešené kvízy
Route::get('/answeredQuizzes/', AnsweredQuizzesController::class.'@index')->middleware('auth:sanctum');
Route::get('/answeredQuizzes/{id}', AnsweredQuizzesController::class.'@show')->middleware('auth:sanctum');

//Obchod
Route::get('/itemsInStore', StoreController::class.'@index')->middleware('auth:sanctum');
