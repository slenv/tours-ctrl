<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\ImageManager;

class UserService
{
    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::find($data['id']);
            if (!$user) {
                $user = new User();
                $user->password = Hash::make($data['username']);
            }

            $user->firstname = $data['firstname'];
            $user->lastname = $data['lastname'];
            $user->phone = $data['phone'] ?: null;
            $user->language = in_array($data['role'], [UserRole::GUIDE->value, UserRole::DRIVER->value]) ? $data['language'] : null;
            $user->license = $data['role'] === UserRole::DRIVER->value ? $data['license'] : null;
            $user->username = $data['username'];
            $user->role = $data['role'];
            $user->save();

            $this->generateDefaultAvatar($user->id, $user->initials);

            return $user;
        });
    }

    public function getGuides()
    {
        return User::where('role', UserRole::GUIDE->value)
            ->get();
    }

    public function getDrivers()
    {
        return User::where('role', UserRole::DRIVER->value)
            ->get();
    }

    public function deleteById(int $id)
    {
        return DB::transaction(function () use ($id) {
            $user = User::find($id);
            if (!$user) {
                return false;
            }
            return $user->delete();
        });
    }

    public function generateDefaultAvatar(int $id, string $text)
    {
        if (file_exists(public_path("avatars/defaults/{$id}.png"))) {
            return;
        }

        $imgSize = 150;
        $manager = new ImageManager(new Driver());
        $background = sprintf('#%06X', mt_rand(0, 0xFFFFFF));
        $image = $manager->create($imgSize, $imgSize)->fill($background);

        $image->text($text, $imgSize / 2, $imgSize / 2, function ($font) {
            $font->filename(public_path('fonts/Blinker-Regular.ttf'));
            $font->size(70);
            $font->color('#ffffff');
            $font->align('center');
            $font->valign('middle');
        });

        $image->save(public_path("avatars/defaults/{$id}.png"), null, new PngEncoder());
    }
}
