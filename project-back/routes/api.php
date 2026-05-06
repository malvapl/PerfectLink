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

Route::middleware('auth:sanctum')->group(function () {
   Route::get('users/weddings', [UserApiController::class, 'weddings']);
   Route::get('userRole/{wedding}', [UserApiController::class, 'roleWedding']);
   Route::get('checkAdmin', [UserApiController::class, 'isAdmin']);
   Route::post('weddings', [WeddingApiController::class, 'store'])->middleware('can:create,App\\Models\\Wedding');
   Route::get('users/joinWedding/{code}', [UserApiController::class, 'joinWedding']);
   Route::get('wedding/{wedding}', [WeddingApiController::class, 'show'])->middleware('can:view,wedding');

   // GUEST ONLY
   Route::post('users/confirmInvite/{wedding}', [GuestApiController::class, 'confirmInvite']);
   Route::post('users/cancelInvite/{wedding}', [GuestApiController::class, 'cancelInvite']);

   // ORGANIZER ONLY
   Route::patch('weddings/{wedding}', [WeddingApiController::class, 'update'])->middleware('can:update,wedding');

   Route::get('weddingInfo/{wedding}', [WeddingApiController::class, 'getInfo'])->middleware('can:view,wedding');
   Route::post('wedding/extraCards/{wedding}', [WeddingApiController::class, 'addInfoCards'])->middleware('can:update,wedding');
   Route::post('wedding/extraCard/{wedding}', [WeddingApiController::class, 'addInfoCard'])->middleware('can:update,wedding');

   Route::get('weddingBuses/{wedding}', [WeddingApiController::class, 'getBuses'])->middleware('can:view,wedding');
   Route::get('weddingPrewedding/{wedding}', [WeddingApiController::class, 'getPrewedding'])->middleware('can:view,wedding');
   Route::post('wedding/updateBus/{wedding}', [WeddingApiController::class, 'updateBus'])->middleware('can:update,wedding');
   Route::post('wedding/addBus/{wedding}', [WeddingApiController::class, 'addBus'])->middleware('can:update,wedding');
   Route::post('wedding/updatePrewedding/{wedding}', [WeddingApiController::class, 'updatePrewedding'])->middleware('can:update,wedding');
   Route::post('cancelPrewedding/{wedding}', [WeddingApiController::class, 'cancelPrewedding'])->middleware('can:update,wedding');
   Route::post('cancelBuses/{wedding}', [WeddingApiController::class, 'cancelBuses'])->middleware('can:update,wedding');

   Route::get('dataGuests/{wedding}', [GuestApiController::class, 'dataGuests']);
   Route::get('guestGroups/{wedding}', [GuestApiController::class, 'guestGroups']);
   Route::post('updateGroup/{wedding}/{guest}', [GuestApiController::class, 'updateGroup'])->middleware('can:update,wedding');;
   Route::post('removeGuests/{wedding}', [GuestApiController::class, 'delete'])->middleware('can:update,wedding');;

   Route::post('tables/{wedding}', [TableApiController::class, 'storeTable']);
   Route::patch('updateTables/{table}', [TableApiController::class, 'updateTable'])->middleware('can:update,table');
   Route::post('tablesSeats/{table}', [TableApiController::class, 'updateSeats'])->middleware('can:update,table');
   Route::delete('tables/{wedding}/{table}', [TableApiController::class, 'destroyTable'])->middleware('can:delete,table');

   // ADMIN ONLY
   Route::get('weddings', [WeddingApiController::class, 'index'])->middleware('can:viewAny,App\\Models\\Wedding');
   Route::delete('weddings/{wedding}', [WeddingApiController::class, 'destroy'])->middleware('can:delete,wedding');
});

Route::get('guests/{wedding}', [GuestApiController::class, 'index']);
Route::get('guestsNotSeated/{wedding}', [GuestApiController::class, 'guestsNotSeated']);

Route::get('tables/{wedding}', [TableApiController::class, 'indexTables']);


Route::fallback(function () {
   return response()->json(['message' => 'Page Not Found'], 404);
});
