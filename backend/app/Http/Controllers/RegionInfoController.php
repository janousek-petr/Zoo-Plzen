<?php

namespace App\Http\Controllers;

use App\Models\RegionInfo;
use Illuminate\Http\Request;

class RegionInfoController extends Controller
{
    /**
     * Výpis všech textů (volitelně filtrované podle regionu přes ?region_id=).
     */
    public function index(Request $request)
    {
        $query = RegionInfo::with('region');

        if ($request->has('region_id')) {
            $query->where('region_id', $request->query('region_id'));
        }

        $infos = $query->orderBy('level')->get();

        return response()->json($infos);
    }

    /**
     * Vytvoření nového textu.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'region_id' => 'required|integer|exists:region,id',
            'level' => 'required|integer|min:1|max:3',
            'text' => 'required|string',
        ]);

        $info = RegionInfo::create($validated);

        return response()->json($info, 201);
    }

    /**
     * Zobrazení jednoho textu.
     */
    public function show(int $id)
    {
        $info = RegionInfo::findOrFail($id);

        return response()->json($info);
    }

    /**
     * Úprava textu.
     */
    public function update(Request $request, int $id)
    {
        $info = RegionInfo::findOrFail($id);

        $validated = $request->validate([
            'region_id' => 'sometimes|required|integer|exists:region,id',
            'level' => 'sometimes|required|integer|min:1|max:3',
            'text' => 'sometimes|required|string',
        ]);

        $info->update($validated);

        return response()->json($info);
    }

    /**
     * Smazání textu.
     */
    public function destroy(int $id)
    {
        $info = RegionInfo::findOrFail($id);
        $info->delete();

        return response()->noContent();
    }

    /**
     * Všechny texty pro daný region, rozdělené podle úrovně.
     * Vrací { "1": [...], "2": [...], "3": [...] }
     */
    public function byRegion(int $regionId)
    {
        $infos = RegionInfo::where('region_id', $regionId)
            ->orderBy('level')
            ->get()
            ->groupBy('level');

        // Zajistíme, že klíče 1, 2, 3 budou vždy přítomné (i jako prázdné pole)
        $grouped = [];
        foreach ([1, 2, 3] as $level) {
            $grouped[$level] = $infos->get($level, collect())->values();
        }

        return response()->json($grouped);
    }
}