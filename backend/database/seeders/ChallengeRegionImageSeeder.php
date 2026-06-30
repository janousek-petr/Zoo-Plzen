<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChallengeRegionImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = [
            [
                'id' => 1,
                'region_id' => 1,
                'url' => '/img/photo-no-bg/lion.png',
                'title' => 'LVÍ JÁMA',
                'alt' => 'Lev',
                'side' => 'right',
            ],
            [
                'id' => 2,
                'region_id' => 2,
                'url' => '/img/photo-no-bg/tiger-turnt.png',
                'title' => 'TYGŘÍ LOV',
                'alt' => 'Tygr',
                'side' => 'right',
            ],
            [
                'id' => 3,
                'region_id' => 3,
                'url' => '/img/photo-no-bg/bear.png',
                'title' => 'LESNÍ POMOCNÍK',
                'alt' => 'Medvěd',
                'side' => 'right',
            ],
            [
                'id' => 4,
                'region_id' => 4,
                'url' => '/img/photo-no-bg/bison-2.png',
                'title' => 'Bizon',
                'alt' => 'Bizon',
                'side' => 'left',
            ],
            [
                'id' => 5,
                'region_id' => 4,
                'url' => '/img/photo-no-bg/bison.png',
                'title' => 'Bizon',
                'alt' => 'Bizon',
                'side' => 'right',
            ],
            [
                'id' => 6,
                'region_id' => 6,
                'url' => '/img/photo-no-bg/kangaroo-2.png',
                'title' => 'Klokan',
                'alt' => 'Klokan',
                'side' => 'left',
            ],
            [
                'id' => 7,
                'region_id' => 6,
                'url' => '/img/photo-no-bg/kangaroo.png',
                'title' => 'Klokan',
                'alt' => 'Klokan',
                'side' => 'right',
            ],
            [
                'id' => 8,
                'region_id' => 2,
                'url' => '/img/photo-no-bg/tiger.png',
                'title' => 'Tygr',
                'alt' => 'Tygr',
                'side' => 'left',
            ],
            [
                'id' => 9,
                'region_id' => 3,
                'url' => '/img/photo-no-bg/wolf.png',
                'title' => 'Vlk',
                'alt' => 'Vlk',
                'side' => 'right',
            ],
            [
                'id' => 10,
                'region_id' => 3,
                'url' => '/img/photo-no-bg/wolf-2.png',
                'title' => 'Vlk',
                'alt' => 'Vlk',
                'side' => 'left',
            ],
            [
                'id' => 11,
                'region_id' => 5,
                'url' => '/img/photo-no-bg/monkey.png',
                'title' => 'Opice',
                'alt' => 'Opice',
                'side' => 'right',
            ],
            [
                'id' => 12,
                'region_id' => 5,
                'url' => '/img/photo-no-bg/monkey-2.png',
                'title' => 'Opice',
                'alt' => 'Opice',
                'side' => 'left',
            ],
            [
                'id' => 13,
                'region_id' => 3,
                'url' => '/img/photo-no-bg/bear-2.png',
                'title' => 'Medvěd',
                'alt' => 'Medvěd',
                'side' => 'left',
            ],
        ];

        foreach ($images as $image) {
            DB::table('challenge_region_image')->updateOrInsert(
                ['id' => $image['id']], // Unikátní klíč pro kontrolu existence
                array_merge($image, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
