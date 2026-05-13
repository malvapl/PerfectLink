<?php

use App\Http\Controllers\GuestApiController;
use App\Http\Controllers\TableApiController;
use App\Http\Controllers\UserApiController;
use App\Http\Controllers\VerificationApiController;
use App\Http\Controllers\WeddingApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
   return $request->user();
});

// register login
Route::post('register', [UserApiController::class, 'register']);
Route::post('login', [UserApiController::class, 'login']);
Route::get('searchEmail/{email}', [VerificationApiController::class, 'searchEmail']);

Route::middleware(['auth:sanctum', 'can:view,wedding'])->group(function () {
   Route::get('wedding/{wedding}', [WeddingApiController::class, 'show']);
   Route::get('weddingInfo/{wedding}', [WeddingApiController::class, 'getInfo']);
   Route::get('weddingBuses/{wedding}', [WeddingApiController::class, 'getBuses']);
   Route::get('weddingPrewedding/{wedding}', [WeddingApiController::class, 'getPrewedding']);

   Route::get('guestGroups/{wedding}', [GuestApiController::class, 'guestGroups']);
});

Route::middleware(['auth:sanctum', 'can:update,wedding'])->group(function () {
   Route::patch('weddings/{wedding}', [WeddingApiController::class, 'update']);
   Route::post('wedding/extraCards/{wedding}', [WeddingApiController::class, 'addInfoCards']);
   Route::post('wedding/extraCard/{wedding}', [WeddingApiController::class, 'addInfoCard']);
   Route::post('wedding/updateBus/{wedding}', [WeddingApiController::class, 'updateBus']);
   Route::post('wedding/addBus/{wedding}', [WeddingApiController::class, 'addBus']);
   Route::post('wedding/updatePrewedding/{wedding}', [WeddingApiController::class, 'updatePrewedding']);
   Route::post('cancelPrewedding/{wedding}', [WeddingApiController::class, 'cancelPrewedding']);
   Route::post('cancelBuses/{wedding}', [WeddingApiController::class, 'cancelBuses']);

   Route::post('updateGroup/{wedding}/{guest}', [GuestApiController::class, 'updateGroup']);
   Route::post('removeGuests/{wedding}', [GuestApiController::class, 'delete']);
   Route::get('guests/{wedding}', [GuestApiController::class, 'index']);
   Route::get('guestsNotSeated/{wedding}', [GuestApiController::class, 'guestsNotSeated']);
   Route::get('dataGuests/{wedding}', [GuestApiController::class, 'dataGuests']);
});

Route::middleware(['auth:sanctum', 'can:delete,wedding'])->group(function () {
   Route::delete('weddings/{wedding}', [WeddingApiController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'can:manageInvite,wedding'])->group(function () {
   Route::post('users/confirmInvite/{wedding}', [GuestApiController::class, 'confirmInvite']);
   Route::post('users/cancelInvite/{wedding}', [GuestApiController::class, 'cancelInvite']);
});

Route::middleware(['auth:sanctum', 'can:view,table'])->group(function () {
   Route::get('tables/{wedding}', [TableApiController::class, 'indexTables']);
});

Route::middleware(['auth:sanctum', 'can:update,table'])->group(function () {
   Route::patch('updateTables/{table}', [TableApiController::class, 'updateTable']);
   Route::post('tablesSeats/{table}', [TableApiController::class, 'updateSeats']);
});

Route::middleware(['auth:sanctum', 'can:delete,table'])->group(function () {
   Route::delete('tables/{wedding}/{table}', [TableApiController::class, 'destroyTable']);
});

Route::middleware(['auth:sanctum'])->group(function () {
   Route::get('users/weddings', [UserApiController::class, 'weddings']);
   Route::get('userRole/{wedding}', [UserApiController::class, 'roleWedding']);
   Route::get('checkAdmin', [UserApiController::class, 'isAdmin']);
   Route::post('users/joinWedding', [UserApiController::class, 'joinWedding']);

   Route::post('weddings', [WeddingApiController::class, 'store'])->middleware('can:create,App\\Models\\Wedding');
   Route::get('weddings', [WeddingApiController::class, 'index'])->middleware('can:viewAny,App\\Models\\Wedding');

   Route::post('tables/{wedding}', [TableApiController::class, 'storeTable']);
});


Route::fallback(function () {
   return response()->json(['message' => 'Page Not Found'], 404);
});
