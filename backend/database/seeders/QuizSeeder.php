<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('quiz')->insert([
            [
                'name' => 'Etiopský kvíz - Level 1',
                'description' => 'Základní otázky o etiopské oblasti.',
                'region_id' => 4,
                'level' => 1,
                'created_at' => now()
            ],
            [
                'name' => 'Etiopský kvíz - Level 2',
                'description' => 'Středně těžké otázky o etiopské oblasti.',
                'region_id' => 4,
                'level' => 2,
                'created_at' => now()
            ],
            [
                'name' => 'Etiopský kvíz - Level 3',
                'description' => 'Těžké otázky o etiopské oblasti.',
                'region_id' => 4,
                'level' => 3,
                'created_at' => now()
            ],
        ]);
    }
}