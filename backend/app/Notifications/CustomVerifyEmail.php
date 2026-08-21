<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    protected function verificationUrl($notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Ověření e-mailové adresy – Zoo v Kapse')
            ->greeting('Dobrý den,')
            ->line('Děkujeme za registraci do aplikace Zoo v Kapse. Pro dokončení registrace a aktivaci vašeho účtu prosím potvrďte svou e-mailovou adresu.')
            ->action('Ověřit e-mailovou adresu', $verificationUrl)
            ->line('Platnost tohoto odkazu vyprší za 60 minut.')
            ->line('Pokud jste si účet nezaložili, tento e-mail můžete bez obav ignorovat.')
            ->salutation('S pozdravem,' . PHP_EOL . 'Tým Zoo v Kapse');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
