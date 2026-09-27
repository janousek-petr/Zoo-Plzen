<?php

namespace App\Http\Controllers;

use App\Challenges\ChallengeGenerator;
use App\Models\ActiveChallenge;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    public function triggerDaily(Request $request, ChallengeGenerator $generator)
    {
        $count = $request->has('count') ? $request->integer('count') : config('challenges.daily_count');
        $terminateExisting = $request->has('terminateExisting') && $request->boolean('terminateExisting');
        $valid_until = $request->input('validUntil')
            ? Carbon::parse($request->input('validUntil'))->endOfDay()
            : now()->endOfDay();

        try {
            DB::transaction(function () use ($generator, $count, $terminateExisting, $valid_until) {

                if ($terminateExisting) {
                    $this->endCurrentChallenges('daily');
                }

                $generator->generateDaily($count, $valid_until);
            });

            return response()->json(["status" => "Daily challenges generated successfully"]);
        } catch (\Exception $e) {
            \Log::error('Selhání při generování denních výzev: ' . $e->getMessage());

            return response()->json([
                "status" => "error",
                "message" => "Při generování výzev došlo k ошибce. Žádné změny nebyly uloženy.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function triggerWeekly(Request $request, ChallengeGenerator $generator)
    {
        $count = $request->has('count') ? $request->integer('count') : config('challenges.weekly_count');
        $terminateExisting = $request->has('terminateExisting') && $request->boolean('terminateExisting');
        $valid_until = $request->input('validUntil')
            ? Carbon::parse($request->input('validUntil'))->endOfDay()
            : now()->endOfWeek();

        try {
            DB::transaction(function () use ($generator, $count, $terminateExisting, $valid_until) {
                if ($terminateExisting) {
                    $this->endCurrentChallenges('weekly');
                }

                $generator->generateWeekly($count, $valid_until);
            });

            return response()->json(["status" => "Weekly challenges generated successfully"]);
        } catch (\Exception $e) {
            \Log::error('Selhání při generování denních výzev: ' . $e->getMessage());

            return response()->json([
                "status" => "error",
                "message" => "Při generování výzev došlo k ошибce. Žádné změny nebyly uloženy.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function trigger(Request $request, ChallengeGenerator $generator)
    {
        $this->triggerDaily($request, $generator);
        $this->triggerWeekly($request, $generator);
        return response()->json(["status" => "Challenges generated via HTTP"]);
    }

    public function endCurrentChallenges(?string $period = null) {
        $active_challenges = ActiveChallenge::where('valid_until', '>', now());

        if ($period) {
            $active_challenges->where('period', $period);
        }

        $active_challenges->update(['valid_until' => now()]);
    }
}
