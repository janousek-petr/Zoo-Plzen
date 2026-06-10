<?php

use App\Http\Controllers\AnsweredQuizzesController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionCategoryController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Autentizace
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest:sanctum');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('profiles', ProfileController::class);
});

// Kvíz
Route::patch('/quizzes/{id}/toggle-publish', [QuizController::class, 'togglePublish']);
Route::apiResource('quizzes', QuizController::class);

// Vyřešené kvízy
Route::get('/answeredQuizzes/', [AnsweredQuizzesController::class, 'index'])->middleware('auth:sanctum');
Route::get('/answeredQuizzes/{id}', [AnsweredQuizzesController::class, 'show'])->middleware('auth:sanctum');

// Obchod
Route::get('/itemsInStore', [StoreController::class, 'index'])->middleware('auth:sanctum');

// Otázky
Route::get('/quizzes/{id}/questions', [QuizController::class, 'questions']);
Route::post('/quizzes/{id}/questions', [QuestionController::class, 'store']);
Route::get('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'show']);
Route::put('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'update']);
Route::delete('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'destroy']);

Route::get('/question-categories', [QuestionCategoryController::class, 'index']);

Route::apiResource('media', MediaController::class)->only(['index', 'store', 'destroy']);

Route::get('/regions/{id}/quizzes', [QuizController::class, 'byRegion']);
Route::get('/regions', [RegionController::class, 'index']);

// Uživatelé
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/users/{id}/profiles', [UserController::class, 'profiles']);
});