<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->profiles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['nullable', 'string', 'max:255'],
            'nickname'   => ['nullable', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'string'],
        ]);

        $profile = $request->user()->profiles()->create($request->only([
            'first_name', 'last_name', 'nickname', 'avatar_url'
        ]));

        return response()->json($profile, 201);
    }

    public function show(Request $request, Profile $profile)
    {
        if ($profile->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($profile);
    }

    public function update(Request $request, Profile $profile)
    {
        if ($profile->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'first_name'       => ['sometimes', 'string', 'max:255'],
            'last_name'        => ['sometimes', 'nullable', 'string', 'max:255'],
            'nickname'         => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar_url'       => ['sometimes', 'nullable', 'string'],
            'accessory_url'    => ['sometimes', 'nullable', 'string'],
            'wallpaper_url'    => ['sometimes', 'nullable', 'string'],
            'displayed_medals' => ['sometimes', 'nullable', 'array', 'max:3'],
        ]);

        $profile->update($request->only([
            'first_name', 'last_name', 'nickname',
            'avatar_url', 'accessory_url', 'wallpaper_url', 'displayed_medals'
        ]));

        return response()->json($profile);
    }

    public function destroy(Request $request, Profile $profile)
    {
        if ($profile->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $profile->delete();

        return response()->json(null, 204);
    }

    public function claimDailyReward(Request $request)
    {
        $profileId = $request->input('profile_id');
        $profile = Profile::find($profileId);

        if (!$profile) {
            return response()->json(['status' => 'error', 'message' => 'Profil nenalezen'], 404);
        }

        // Zkontrolujeme, zda dnes už odměnu dostal
        if ($profile->last_daily_reward_at && $profile->last_daily_reward_at->isToday()) {
            return response()->json([
                'status' => 'already_claimed',
                'message' => 'Dnes už byla odměna pro tento profil vybrána.'
            ]);
        }

        // Přičtení odměny
        $profile->update([
            'last_daily_reward_at' => Carbon::now(),
            'points' => $profile->points + 10
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Odměna připsána!',
            'new_points' => $profile->points
        ]);
    }
}
