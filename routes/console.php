<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * The demo's two accounts: Jo, who shops, and an admin for the Control
 * Panel. Both use the password "password", so this only runs locally.
 */
Artisan::command('demo:users', function () {
    if (! app()->environment('local')) {
        $this->error('demo:users only runs with APP_ENV=local: its passwords are public.');

        return 1;
    }

    $accounts = [
        ['jo@example.com', 'Jo Shopper', false],
        ['admin@example.com', 'Admin', true],
    ];

    foreach ($accounts as [$email, $name, $super]) {
        $user = \Statamic\Facades\User::findByEmail($email) ?? \Statamic\Facades\User::make()->email($email);
        $user->set('name', $name)->password('password')->makeSuper($super)->save();
        $this->info("{$email} / password".($super ? ' (Control Panel)' : ''));
    }
})->purpose('Create the demo shopper and admin accounts');
