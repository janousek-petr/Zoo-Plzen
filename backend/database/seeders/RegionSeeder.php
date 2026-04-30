<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('region')->updateOrInsert(
            ['id' => 1], // Pokud id 1 existuje, jen ho aktualizuje
            ['name' => 'Palearktická oblast'] // Jinak ho vytvoří
        );
        
        // Můžeš jich přidat víc, pokud chceš
        DB::table('region')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Nearktická oblast']
        );
    }
}
