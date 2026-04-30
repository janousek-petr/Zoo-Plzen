<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('question_category')->updateOrInsert(
            ['id' => 1],
            ['name' => 'Savci']
        );

        DB::table('question_category')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Ptáci']
        );

        DB::table('question_category')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Plazi']
        );

        DB::table('question_category')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Všeobecné']
        );
    }
}