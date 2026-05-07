<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('region')->updateOrInsert(
            ['id' => 1],
            ['name' => 'Palearktická oblast']
        );
        
        DB::table('region')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Nearktická oblast']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Neotropická oblast']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Etiopská oblast']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 5],
            ['name' => 'Australská oblast']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 6],
            ['name' => 'Orientální oblast']
        );
    }
}
