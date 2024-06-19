<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\GuestApiController;
use App\Http\Controllers\TableApiController;
use App\Http\Controllers\UserApiController;
use App\Http\Controllers\VerificationApiController;
use App\Http\Controllers\WeddingApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the 'api' middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
   return $request->user();
});


Route::get('wedding/{wedding}', [WeddingApiController::class, 'show']);
Route::get('users/weddings', [UserApiController::class, 'weddings']);
Route::get('userRole/{wedding}', [UserApiController::class, 'roleWedding']);
Route::get('checkAdmin', [UserApiController::class, 'isAdmin']);


// register login
Route::post('registro', [UserApiController::class, 'register'])->name('registro');
Route::post('login', [UserApiController::class, 'login'])->name('login');
Route::get('searchEmail/{email}', [VerificationApiController::class, 'searchEmail']);


// create wedding
Route::post('weddings', [WeddingApiController::class, 'store']);

// join wedding 
Route::get('users/joinWedding/{code}', [UserApiController::class, 'joinWedding']);
Route::get('wedding/codeGuest/{code}', [UserApiController::class, 'existsCodeGuest']);
Route::get('wedding/codeOrg/{code}', [UserApiController::class, 'existsCodeOrg']);



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

Route::get('guests/{wedding}', [GuestApiController::class, 'index']);
Route::get('guestsNotSeated/{wedding}', [GuestApiController::class, 'guestsNotSeated']);
Route::get('dataGuests/{wedding}', [GuestApiController::class, 'dataGuests']);
Route::post('removeGuests/{wedding}', [GuestApiController::class, 'delete']);
Route::get('guestGroups/{wedding}', [GuestApiController::class, 'guestGroups']);
Route::post('updateGroup/{wedding}/{guest}', [GuestApiController::class, 'updateGroup']);

Route::get('tables/{wedding}', [TableApiController::class, 'indexTables']);
Route::post('tables/{wedding}', [TableApiController::class, 'storeTable']);      // ->middleware(['auth:sanctum', 'abilities:post-table']);
Route::patch('updateTables/{table}', [TableApiController::class, 'updateTable']);     // ->middleware(['auth:sanctum', 'abilities:patch-table']);
Route::post('tablesSeats/{table}', [TableApiController::class, 'updateSeats']);
Route::delete('tables/{wedding}/{table}', [TableApiController::class, 'destroyTable']); // ->middleware(['auth:sanctum', 'abilities:delete-table']);

// ADMIN ONLY
Route::get('weddings', [WeddingApiController::class, 'index']);
Route::delete('weddings/{wedding}', [WeddingApiController::class, 'destroy']);  // ->middleware(['auth:sanctum', 'abilities:delete  -wedding', 'role:admin']);



Route::fallback(function(){
   return response()->json([
       'message' => 'Page Not Found. If error persists, contact info@website.com'], 404);
});
