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

// join wedding
Route::get('wedding/codeGuest/{code}', [UserApiController::class, 'existsCodeGuest']);
Route::get('wedding/codeOrg/{code}', [UserApiController::class, 'existsCodeOrg']);

Route::middleware('auth:sanctum')->group(function () { //? loggeado
   Route::get('users/weddings', [UserApiController::class, 'weddings']);
   Route::get('userRole/{wedding}', [UserApiController::class, 'roleWedding']);
   Route::get('checkAdmin', [UserApiController::class, 'isAdmin']);
   Route::post('weddings', [WeddingApiController::class, 'store']); // create wedding
   Route::get('users/joinWedding/{code}', [UserApiController::class, 'joinWedding']);
   Route::get('wedding/{wedding}', [WeddingApiController::class, 'show']);

   // GUEST ONLY
   Route::post('users/confirmInvite/{wedding}', [GuestApiController::class, 'confirmInvite']);
   Route::post('users/cancelInvite/{wedding}', [GuestApiController::class, 'cancelInvite']);

   // ORGANIZER ONLY
   Route::patch('weddings/{wedding}', [WeddingApiController::class, 'update']);    // ->middleware(['auth:sanctum', 'abilities:patch-wedding']);

   Route::get('weddingInfo/{wedding}', [WeddingApiController::class, 'getInfo']);
   Route::post('wedding/extraCards/{wedding}', [WeddingApiController::class, 'addInfoCards']);
   Route::post('wedding/extraCard/{wedding}', [WeddingApiController::class, 'addInfoCard']);

   Route::get('weddingBuses/{wedding}', [WeddingApiController::class, 'getBuses']);
   Route::get('weddingPrewedding/{wedding}', [WeddingApiController::class, 'getPrewedding']);
   Route::post('wedding/updateBus/{wedding}', [WeddingApiController::class, 'updateBus']);
   Route::post('wedding/addBus/{wedding}', [WeddingApiController::class, 'addBus']);
   Route::post('wedding/updatePrewedding/{wedding}', [WeddingApiController::class, 'updatePrewedding']);
   Route::post('cancelPrewedding/{wedding}', [WeddingApiController::class, 'cancelPrewedding']);
   Route::post('cancelBuses/{wedding}', [WeddingApiController::class, 'cancelBuses']);

   Route::get('dataGuests/{wedding}', [GuestApiController::class, 'dataGuests']);
   Route::get('guestGroups/{wedding}', [GuestApiController::class, 'guestGroups']);
   Route::post('updateGroup/{wedding}/{guest}', [GuestApiController::class, 'updateGroup']);
   Route::post('removeGuests/{wedding}', [GuestApiController::class, 'delete']);

   Route::post('tables/{wedding}', [TableApiController::class, 'storeTable']);      // ->middleware(['auth:sanctum', 'abilities:post-table']);
   Route::patch('updateTables/{table}', [TableApiController::class, 'updateTable']);     // ->middleware(['auth:sanctum', 'abilities:patch-table']);
   Route::post('tablesSeats/{table}', [TableApiController::class, 'updateSeats']);
   Route::delete('tables/{wedding}/{table}', [TableApiController::class, 'destroyTable']); // ->middleware(['auth:sanctum', 'abilities:delete-table']);

   // ADMIN ONLY
   Route::get('weddings', [WeddingApiController::class, 'index']);
   Route::delete('weddings/{wedding}', [WeddingApiController::class, 'destroy']);  // ->middleware(['auth:sanctum', 'abilities:delete  -wedding', 'role:admin']);
});

Route::get('guests/{wedding}', [GuestApiController::class, 'index']);
Route::get('guestsNotSeated/{wedding}', [GuestApiController::class, 'guestsNotSeated']);

Route::get('tables/{wedding}', [TableApiController::class, 'indexTables']);


Route::fallback(function () {
   return response()->json(['message' => 'Page Not Found'], 404);
});
