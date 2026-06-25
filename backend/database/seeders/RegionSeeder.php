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
            ['name' => 'Afrika']
        );
        
        DB::table('region')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Asie']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Evropa']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Severní Amerika']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 5],
            ['name' => 'Jižní Amerika']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 6],
            ['name' => 'Austrálie']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 7],
            ['name' => 'Antarktida']
        );
    }
}
