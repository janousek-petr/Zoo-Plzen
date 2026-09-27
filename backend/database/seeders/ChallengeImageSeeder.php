<?php

namespace Database\Seeders;

use App\Models\ChallengeImage;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChallengeImageSeeder extends Seeder
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
                'path' => 'img/photo-no-bg/lion.png',
                'title' => 'LVÍ JÁMA',
                'alt' => 'Lev',
                'side' => 'right',
            ],
            [
                'id' => 2,
                'region_id' => 2,
                'path' => 'img/photo-no-bg/tiger-turnt.png',
                'title' => 'TYGŘÍ LOV',
                'alt' => 'Tygr',
                'side' => 'right',
            ],
            [
                'id' => 3,
                'region_id' => 3,
                'path' => 'img/photo-no-bg/bear.png',
                'title' => 'LESNÍ POMOCNÍK',
                'alt' => 'Medvěd',
                'side' => 'right',
            ],
            [
                'id' => 4,
                'region_id' => 4,
                'path' => 'img/photo-no-bg/bison-2.png',
                'title' => 'Bizon',
                'alt' => 'Bizon',
                'side' => 'left',
            ],
            [
                'id' => 5,
                'region_id' => 4,
                'path' => 'img/photo-no-bg/bison.png',
                'title' => 'Bizon',
                'alt' => 'Bizon',
                'side' => 'right',
            ],
            [
                'id' => 6,
                'region_id' => 6,
                'path' => 'img/photo-no-bg/kangaroo-2.png',
                'title' => 'Klokan',
                'alt' => 'Klokan',
                'side' => 'left',
            ],
            [
                'id' => 7,
                'region_id' => 6,
                'path' => 'img/photo-no-bg/kangaroo.png',
                'title' => 'Klokan',
                'alt' => 'Klokan',
                'side' => 'right',
            ],
            [
                'id' => 8,
                'region_id' => 2,
                'path' => 'img/photo-no-bg/tiger.png',
                'title' => 'Tygr',
                'alt' => 'Tygr',
                'side' => 'left',
            ],
            [
                'id' => 9,
                'region_id' => 3,
                'path' => 'img/photo-no-bg/wolf.png',
                'title' => 'Vlk',
                'alt' => 'Vlk',
                'side' => 'right',
            ],
            [
                'id' => 10,
                'region_id' => 3,
                'path' => 'img/photo-no-bg/wolf-2.png',
                'title' => 'Vlk',
                'alt' => 'Vlk',
                'side' => 'left',
            ],
            [
                'id' => 11,
                'region_id' => 5,
                'path' => 'img/photo-no-bg/monkey.png',
                'title' => 'Opice',
                'alt' => 'Opice',
                'side' => 'right',
            ],
            [
                'id' => 12,
                'region_id' => 5,
                'path' => 'img/photo-no-bg/monkey-2.png',
                'title' => 'Opice',
                'alt' => 'Opice',
                'side' => 'left',
            ],
            [
                'id' => 13,
                'region_id' => 3,
                'path' => 'img/photo-no-bg/bear-2.png',
                'title' => 'Medvěd',
                'alt' => 'Medvěd',
                'side' => 'left',
            ],
        ];

        foreach ($images as $image) {
            $path = ltrim($image['path'], '/');
            $filename = basename($path);
            $fullPath = public_path($path);

            // Výpočet hash souboru + velikosti s kontrolou existence
            $fileExists = file_exists($fullPath);
            $fileHash = $fileExists ? hash_file("sha256", $fullPath) : hash("sha256", $path);
            $fileSize = $fileExists ? filesize($fullPath) : 0;

            // 1. Vytvoření nebo úprava záznamu v tabulce media
            Media::updateOrInsert(
                ['path' => $path],
                [
                    'filename' => $filename,
                    'file_hash' => $fileHash,
                    'mime_type' => 'image/png',
                    'size' => $fileSize,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Načtení ID nově vytvořeného/stávajícího média
            $mediaRecord = Media::where('path', $path)->first();

            // 2. Vložení záznamu do challenge_image s vazbou přes media_id
            ChallengeImage::updateOrInsert(
                ['id' => $image['id']],
                [
                    'media_id' => $mediaRecord->id,
                    'region_id' => $image['region_id'],
                    'title' => $image['title'],
                    'alt' => $image['alt'],
                    'side' => $image['side'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
