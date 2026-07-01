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
            ['name' => 'true_false']
        );

        DB::table('question_category')->updateOrInsert(
            ['id' => 2],
            ['name' => 'select']
        );

        DB::table('question_category')->updateOrInsert(
            ['id' => 3],
            ['name' => 'media_select']
        );
    }
}