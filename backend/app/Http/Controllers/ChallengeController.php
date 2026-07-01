<?php

namespace App\Http\Controllers;

use App\Challenges\ChallengeGenerator;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function triggerDaily(Request $request, ChallengeGenerator $generator)
    {
        $count = $request->has('count') ? $request->integer('count') : config('challenges.daily_count');
        $generator->generateDaily($count);

        return response()->json(["status" => "Daily challenges generated via HTTP"]);
    }

    public function triggerWeekly(Request $request, ChallengeGenerator $generator)
    {
        // Vytáhneme int z requestu (pokud tam je)
        $count = $request->has('count') ? $request->integer('count') : config('challenges.weekly_count');

        // Spustíme čistou službu
        $generator->generateWeekly($count);

        return response()->json(["status" => "Weekly challenges generated via HTTP"]);
    }

    public function trigger(Request $request, ChallengeGenerator $generator)
    {
        $this->triggerDaily($request, $generator);
        $this->triggerWeekly($request, $generator);
        return response()->json(["status" => "Challenges generated via HTTP"]);
    }
}
