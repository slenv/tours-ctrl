<?php

namespace Database\Seeders;

use App\Enums\PaymentAccountStatus;
use App\Enums\UserRole;
use App\Models\PaymentAccount;
use App\Services\UserService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function __construct(protected UserService $userService)
    {
    }

    public function run(): void
    {
        $users = [
            [
                'id' => null,
                'firstname' => 'Lino',
                'lastname' => 'Palomino',
                'phone' => null,
                'language' => null,
                'license' => null,
                'username' => 'slenv',
                'password' => Hash::make('slenv'),
                'role' => UserRole::ADMIN->value,
            ],
            [
                'id' => null,
                'firstname' => 'Lucas Enrique',
                'lastname' => 'Bravo Pérez',
                'phone' => '+51912345678, +51987654321',
                'language' => 'Español, Inglés, Francés',
                'license' => null,
                'username' => '71234567',
                'password' => Hash::make('71234567'),
                'role' => UserRole::GUIDE->value
            ],
            [
                'id' => null,
                'firstname' => 'Leonardo Alejandro',
                'lastname' => 'Soto Martinez',
                'phone' => '+51912312312',
                'language' => 'Español, Inglés',
                'license' => 'X01234567',
                'username' => '01234567',
                'password' => Hash::make('01234567'),
                'role' => UserRole::DRIVER->value
            ],
        ];

        foreach ($users as $user) {
            $this->userService->save($user);
        }

        $paymentAccounts = [
            [
                'holder_name' => 'Lino A. Palomino V.',
                'description' => 'Yape',
                'reference' => '960633374',
                'status' => PaymentAccountStatus::ACTIVE->value
            ],
            [
                'holder_name' => 'Lino Palomino',
                'description' => 'BCP - Ahorros',
                'reference' => '00-111-222333-444555666-77',
                'status' => PaymentAccountStatus::ACTIVE->value
            ],
        ];

        foreach ($paymentAccounts as $paymentAccount) {
            PaymentAccount::create($paymentAccount);
        }
    }
}
