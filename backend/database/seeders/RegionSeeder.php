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
            ['name' => 'Afrika', 'color' => '#BD9554']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Asie', 'color' => '#FDB913']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Evropa', 'color' => '#0072BC']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Severní Amerika', 'color' => '#8E5233']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 5],
            ['name' => 'Jižní Amerika', 'color' => '#0072BC']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 6],
            ['name' => 'Austrálie', 'color' => '#076D3C']
        );

        DB::table('region')->updateOrInsert(
            ['id' => 7],
            ['name' => 'Antarktida', 'color' => '#076D3C']
        );
    }
}
