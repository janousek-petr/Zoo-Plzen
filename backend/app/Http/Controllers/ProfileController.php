<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Item;
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

    /**
     * Kolik XP je potřeba nasbírat v daném levelu, než se přejde na další.
     * Musí odpovídat frontendové funkci xpForNextLevel() v ProfileTab.
     */
    private function xpForLevel(int $level): int
    {
        return $level * 100 + 100;
    }

    /**
     * XP je "postup v rámci aktuálního levelu", ne celoživotní součet.
     * Pokud XP přesáhne práh pro level, přeteče do dalšího levelu (může
     * to proběhnout i vícekrát za sebou, když se přidá hodně XP najednou).
     * Vrací [level, xp] po normalizaci.
     */
    private function normalizeLevelXp(int $level, int $xp): array
    {
        if ($level < 1) {
            $level = 1;
        }
        if ($xp < 0) {
            $xp = 0;
        }

        while ($xp >= $this->xpForLevel($level)) {
            $xp -= $this->xpForLevel($level);
            $level++;
        }

        return [$level, $xp];
    }

    /**
     * Zajistí, že daný item je v inventáři profilu — pokud tam ještě
     * není, přidá ho (bez toho by ho equip/getInventory nikdy nenašlo,
     * protože avatar/accessory/wallpaper item musí být vlastněný).
     */
    private function ensureItemInInventory(Profile $profile, ?int $itemId): void
    {
        if (!$itemId) {
            return;
        }

        $inventory = $profile->inventory;

        if (!$inventory) {
            $inventory = Inventory::create(['profile_id' => $profile->id]);
        }

        $alreadyOwned = $inventory->items()->where('item_id', $itemId)->exists();

        if (!$alreadyOwned) {
            $inventory->items()->attach($itemId, ['acquisition_date' => now()]);
        }
    }

    public function update(Request $request, Profile $profile)
    {
        if ($profile->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'first_name'         => ['sometimes', 'string', 'max:255'],
            'last_name'          => ['sometimes', 'nullable', 'string', 'max:255'],
            'nickname'           => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar_url'         => ['sometimes', 'nullable', 'string'],
            'accessory_url'      => ['sometimes', 'nullable', 'string'],
            'wallpaper_url'      => ['sometimes', 'nullable', 'string'],
            'avatar_item_id'     => ['sometimes', 'nullable', 'integer', 'exists:' . (new Item)->getTable() . ',id'],
            'accessory_item_id'  => ['sometimes', 'nullable', 'integer', 'exists:' . (new Item)->getTable() . ',id'],
            'wallpaper_item_id'  => ['sometimes', 'nullable', 'integer', 'exists:' . (new Item)->getTable() . ',id'],
            'displayed_medals'   => ['sometimes', 'nullable', 'array', 'max:3'],
            'level'              => ['sometimes', 'integer', 'min:1'],
            'xp'                 => ['sometimes', 'integer', 'min:0'],
            'points'             => ['sometimes', 'integer', 'min:0'],
        ]);

        // Admin může upravit vše (včetně level/xp/points),
        // běžný uživatel jen svůj vlastní profil bez herních statistik.
        $allowedFields = [
            'first_name', 'last_name', 'nickname',
            'avatar_url', 'accessory_url', 'wallpaper_url',
            'avatar_item_id', 'accessory_item_id', 'wallpaper_item_id',
            'displayed_medals',
        ];

        if ($request->user()->role === 'admin') {
            $allowedFields = array_merge($allowedFields, ['level', 'xp', 'points']);
        }

        $data = $request->only($allowedFields);

        // Pokud se mění level nebo xp, přepočítáme přetečení do dalšího levelu.
        if (array_key_exists('level', $data) || array_key_exists('xp', $data)) {
            $newLevel = $data['level'] ?? $profile->level;
            $newXp = $data['xp'] ?? $profile->xp;

            [$data['level'], $data['xp']] = $this->normalizeLevelXp((int) $newLevel, (int) $newXp);
        }

        $profile->update($data);

        // Pokud admin nastavil avatar/doplněk/tapetu, ujistíme se, že
        // profil danou položku má i ve svém inventáři.
        foreach (['avatar_item_id', 'accessory_item_id', 'wallpaper_item_id'] as $field) {
            if (array_key_exists($field, $data)) {
                $this->ensureItemInInventory($profile, $data[$field]);
            }
        }

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