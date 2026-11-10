<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendVerificationCode extends Notification
{
    use Queueable;

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
        return (new MailMessage)
            ->subject('Zoo v kapse - Váš ověřovací kód')
            ->greeting('Ahoj '.$notifiable->first_name.'!')
            ->line('Váš ověřovací kód pro dokončení registrace je:')
            ->line('**'.$notifiable->verification_code.'**')
            ->line('Kód vyprší za 15 minut.')
            ->salutation('S pozdravem'.PHP_EOL.'Zoo v Kapse');
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
