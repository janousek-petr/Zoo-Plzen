<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:generate-challenges --daily')->dailyAt('00:00');
Schedule::command('app:generate-challenges --weekly')->weeklyOn(1,'00:00');
