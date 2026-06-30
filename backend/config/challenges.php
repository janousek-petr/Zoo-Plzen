<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Počet výzev
    |--------------------------------------------------------------------------
    */

    "daily_count" => 3,
    "weekly_count" => 3,

    /*
    |--------------------------------------------------------------------------
    | Šablony výzev
    |--------------------------------------------------------------------------
    |
    | Každá šablona má:
    | - challenge_type: identifikátor evaluátoru
    | - description: Úkol
    | - min/max: pro generování náhodných hodnot
    | - reward: volitelné (jinak se dopočítá)
    |
    */

    "templates" => [

        // ---------------------------------------------------------
        // Správné odpovědi v dané oblasti
        // ---------------------------------------------------------
        "region_correct_answers" => [
            "type" => "region_correct_answers",
            "title" => "Průzkumník otázek",
            "description" => 'Odpověz správně na {count} otázek v oblasti "{region}"',
            "code_pattern" => "correct_{count}_region_{region_id}",
            "min" => 5,
            "max" => 20,
            "reward" => 9
        ],
        "correct_answers" => [
            "type" => "correct_answers",
            "title" => "Průzkumník otázek",
            "description" => "Odpověz správně na {count} otázek.",
            "code_pattern" => "correct_{count}_answers",
            "min" => 5,
            "max" => 20,
            "reward" => 9
        ],
        'region_quizzes' => [
            'type' => 'region_quiz_completed',
            'title' => 'Průzkumník oblastí',
            'description' => 'Dokonči {count} kvízů v oblasti "{region}".',
            "code_pattern" => "quiz_{count}_region_{region_id}",
            "min" => 5,
            "max" => 20,
            "reward" => 8
        ],
        'quiz_completed' => [
            'type' => 'quiz_completed',
            'title' => 'Bystrý žák',
            'description' => 'Dokonči {count} kvízů.',
            "code_pattern" => "complete_{count}_quiz",
            "min" => 5,
            "max" => 20,
            "reward" => 8
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Denní úpravy (Daily)
    |--------------------------------------------------------------------------
    */
    'daily' => [
        [
            'templates' => 'region_quizzes', // Odkaz na klíč v sekci 'template'
            'description' => 'Dokonči {count} kvíz v oblasti "{region}".',
            'min' => 1,
            'max' => 1,
            'reward' => 15,
        ],
        [
            'templates' => 'quiz_completed', // Odkaz na klíč v sekci 'template'
            'description' => 'Dokonči {count} kvíz.',
            'min' => 1,
            'max' => 1,
            'reward' => 15,
        ],
        [
            'templates' => 'region_correct_answers',
            'min' => 3,
            'max' => 5,
            'reward' => 3,
        ],
        [
            'templates' => 'correct_answers',
            'min' => 3,
            'max' => 5,
            'reward' => 3,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Týdenní úpravy (Weekly)
    |--------------------------------------------------------------------------
    */
    'weekly' => [
        [
            'templates' => 'region_quizzes',
            'min' => 5,
            'max' => 8,
            'reward' => 15,
        ],
        [
            'templates' => 'quiz_completed',
            'min' => 5,
            'max' => 8,
            'reward' => 15,
        ],
        [
            'templates' => 'region_correct_answers',
            'min' => 10,
            'max' => 20,
            'reward' => 12,
        ],
        [
            'templates' => 'correct_answers',
            'min' => 10,
            'max' => 20,
            'reward' => 12,
        ],
    ],
];
