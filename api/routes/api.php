<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
    Route::middleware('auth:jwt')->group(function () {
        Route::get('/me', [App\Http\Controllers\AuthController::class, 'me']);
        Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
        Route::get('/refresh', [App\Http\Controllers\AuthController::class, 'refresh']);
    });
});

Route::middleware('auth:jwt')->group(function () {
    Route::group(['prefix' => 'users'], function () {
        Route::post('/', [App\Http\Controllers\UserController::class, 'store']);
        Route::get('/guides', [App\Http\Controllers\UserController::class, 'guides']);
        Route::get('/drivers', [App\Http\Controllers\UserController::class, 'drivers']);
        Route::delete('/{id}', [App\Http\Controllers\UserController::class, 'delete']);
    });

    Route::group(['prefix' => 'identity'], function () {
        Route::get('/dni/{dni}', [App\Http\Controllers\IdentityController::class, 'dni']);
        Route::get('/ruc/{ruc}', [App\Http\Controllers\IdentityController::class, 'ruc']);
        Route::get('/ce/{ce}', [App\Http\Controllers\IdentityController::class, 'ce']);
    });

    Route::group(['prefix' => 'vehicle-registry'], function () {
        Route::get('/plate/{plate}', [App\Http\Controllers\VehicleRegistryController::class, 'plate']);
    });

    Route::group(['prefix' => 'payment-accounts'], function () {
        Route::get('/all', [App\Http\Controllers\PaymentAccountController::class, 'all']);
        Route::post('/', [App\Http\Controllers\PaymentAccountController::class, 'store']);
        Route::get('/trashed', [App\Http\Controllers\PaymentAccountController::class, 'trashed']);
        Route::delete('/{id}', [App\Http\Controllers\PaymentAccountController::class, 'delete']);
        Route::patch('/restore', [App\Http\Controllers\PaymentAccountController::class, 'restore']);
        Route::patch('/{id}/toggle-status', [App\Http\Controllers\PaymentAccountController::class, 'toggleStatus']);
        Route::post('/{id}/upload-qr', [App\Http\Controllers\PaymentAccountController::class, 'uploadQr']);
        Route::patch('/{id}/remove-qr', [App\Http\Controllers\PaymentAccountController::class, 'deleteQr']);
    });

    Route::group(['prefix' => 'customers'], function () {
        Route::get('/', [App\Http\Controllers\CustomerController::class, 'paginate']);
        Route::post('/', [App\Http\Controllers\CustomerController::class, 'store']);
        Route::get('/trashed', [App\Http\Controllers\CustomerController::class, 'trashed']);
        Route::delete('/{id}', [App\Http\Controllers\CustomerController::class, 'delete']);
        Route::patch('/restore', [App\Http\Controllers\CustomerController::class, 'restore']);
    });

    Route::group(['prefix' => 'vehicles'], function () {
        Route::get('/all', [App\Http\Controllers\VehicleController::class, 'all']);
        Route::post('/', [App\Http\Controllers\VehicleController::class, 'store']);
        Route::get('/trashed', [App\Http\Controllers\VehicleController::class, 'trashed']);
        Route::delete('/{id}', [App\Http\Controllers\VehicleController::class, 'delete']);
        Route::patch('/restore', [App\Http\Controllers\VehicleController::class, 'restore']);
        Route::patch('/{id}/change-status', [App\Http\Controllers\VehicleController::class, 'changeStatus']);
        Route::get('/', [App\Http\Controllers\VehicleController::class, 'show']);
    });

    Route::group(['prefix' => 'tour-packages'], function () {
        Route::get('/all', [App\Http\Controllers\TourPackageController::class, 'all']);
        Route::get('/trashed', [App\Http\Controllers\TourPackageController::class, 'trashed']);
        Route::post('/', [App\Http\Controllers\TourPackageController::class, 'store']);
        Route::delete('/{id}', [App\Http\Controllers\TourPackageController::class, 'delete']);
        Route::patch('/{id}', [App\Http\Controllers\TourPackageController::class, 'restore']);
    });
});

