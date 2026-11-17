<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Challenges\ActiveChallengeController;
use App\Http\Controllers\Challenges\ChallengeController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Item\ItemCategoryController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Media\MediaController;
use App\Http\Controllers\Question\QuestionCategoryController;
use App\Http\Controllers\Question\QuestionController;
use App\Http\Controllers\Quiz\AnsweredQuizzesController;
use App\Http\Controllers\Quiz\QuizController;
use App\Http\Controllers\Region\RegionController;
use App\Http\Controllers\Region\RegionInfoController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Autentizace
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest:sanctum');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest:sanctum');

// Profil
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('profiles', ProfileController::class);
});

//Texty (Info) k regionům
Route::get('/regions/{id}/infos', [RegionInfoController::class, 'byRegion']);
Route::apiResource('region-infos', RegionInfoController::class);

// Kvíz
Route::patch('/quizzes/{id}/toggle-publish', [QuizController::class, 'togglePublish']);
Route::post('/quizzes/start-random', [QuizController::class, 'startRandom']);
Route::apiResource('quizzes', QuizController::class);

// Vyřešené kvízy
Route::get('/answeredQuizzes/', [AnsweredQuizzesController::class, 'index'])->middleware('auth:sanctum');
Route::get('/answeredQuizzes/{id}', [AnsweredQuizzesController::class, 'show'])->middleware('auth:sanctum');
Route::post('/answeredQuizzes', [AnsweredQuizzesController::class, 'store'])->middleware('auth:sanctum');

//Předměty
Route::apiResource('items', ItemController::class);
Route::get('/item-categories', [ItemCategoryController::class, 'index']);

// Obchod
Route::get('/profiles/{profile}/store', [StoreController::class, 'index'])->middleware('auth:sanctum');
Route::post('/profiles/{profile}/store/buy', [StoreController::class, 'buy'])->middleware('auth:sanctum');

// Otázky
Route::get('/quizzes/{id}/questions', [QuizController::class, 'questions']);
Route::post('/quizzes/{id}/questions', [QuestionController::class, 'store']);
Route::get('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'show']);
Route::put('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'update']);
Route::delete('/quizzes/{quizId}/questions/{questionId}', [QuestionController::class, 'destroy']);

Route::get('/question-categories', [QuestionCategoryController::class, 'index']);

// Media
Route::apiResource('media', MediaController::class)->only(['index', 'store', 'destroy']);
Route::get('/media/check-hash/{file_hash}', [MediaController::class, 'checkIfMediaExists'])->name('media.check-hash');

Route::get('/regions/{id}/quizzes', [QuizController::class, 'byRegion']);
Route::get('/regions', [RegionController::class, 'index']);

// Uživatelé
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/users/{id}/profiles', [UserController::class, 'profiles']);
});

//Profil - Inventář
Route::get('/profiles/{profile}/inventory', [InventoryController::class, 'index'])->middleware('auth:sanctum');
Route::post('/profiles/{profile}/equip', [InventoryController::class, 'equip'])->middleware('auth:sanctum');
Route::post('/profiles/{profile}/inventory/giveItem', [InventoryController::class, 'giveItem']);

//Výzvy
Route::post('/challenges', [ActiveChallengeController::class, 'index']);
Route::get('/challenges/{id}', [ActiveChallengeController::class, 'show']);
Route::put('/challenges/{id}', [ActiveChallengeController::class, 'update']);
Route::post('/challenges/event', [ActiveChallengeController::class, 'submitEvent']);
Route::post('/profiles/claim-daily-reward', [ProfileController::class, 'claimDailyReward']); # Daily login

Route::post('/admin/active-challenges', [ActiveChallengeController::class, 'store']);
Route::delete('/admin/active-challenges/{id}', [ActiveChallengeController::class, 'destroy']);

// Generátor výzev
Route::post('/generate/weeklyChallenges', [ChallengeController::class, 'triggerWeekly']);
Route::post('/generate/dailyChallenges', [ChallengeController::class, 'triggerDaily']);

// Level a XP
Route::post('/addLevel', [ProfileController::class, 'addLevel']);
Route::post('/addXp', [ProfileController::class, 'addXp']);
