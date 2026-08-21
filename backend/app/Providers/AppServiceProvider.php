<?php

namespace App\Providers;

use App\Challenges\ChallengeCompleted;
use App\Challenges\DistributeChallengeReward;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            ChallengeCompleted::class,
             DistributeChallengeReward::class
        );

        // Úprava e-mailu a odkazu pro obnovu hesla
        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            // 1. Sestavení URL adresy směřující na Next.js
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $url = $frontendUrl . '/obnoveni-hesla/' . $token . '?email=' . urlencode($notifiable->getEmailForPasswordReset());

            // 2. Úprava textu a tlačítek v e-mailu
            return (new MailMessage)
                ->subject('Obnovení hesla k Vašemu účtu')
                ->greeting('Dobrý den,')
                ->line('Obdrželi jsme požadavek na obnovení hesla k Vašemu účtu.')
                ->action('Obnovit heslo', $url)
                ->line('Tento odkaz pro obnovení hesla vyprší za ' . config('auth.passwords.'.config('auth.defaults.passwords').'.expire') . ' minut.')
                ->line('Pokud jste o obnovení hesla nežádali, můžete tento e-mail bez obav ignorovat.')
                ->salutation("S pozdravem,\nZoo v Kapse");
        });
    }
}
