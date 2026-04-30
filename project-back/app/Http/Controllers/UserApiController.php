<?php

namespace App\Http\Controllers;

use App\Http\Resources\WeddingGeneralResource;
use App\Http\Resources\WeddingUserResource;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Laravel\Sanctum\PersonalAccessToken;

class UserApiController extends Controller
{

   /**
    * Login user
    *
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse token and idWedding if exists
    */
   public function login(Request $request)
   {
      $credentials = $request->only('email', 'password');

      if (Auth::attempt($credentials)) {
         $user = Auth::user();

         $token = $user->createToken('API Token')->plainTextToken;

         $idWedding = $user->hasOwnWedding();
         if ($idWedding !== 0) {
            return response()->json(['token' => $token, 'wedding' => $idWedding]);
         } else {
            return response()->json(['token' => $token]);
         }
      } else {
         return response()->json(['message' => 'Unauthorized'], 401);
      }
   }

   /**
    * Register user
    *
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse user or error
    */
   public function register(Request $request)
   {
      $validator = Validator::make($request->all(), [
         'name' => ['required', 'string', 'max:255'],
         'lastname' => ['required', 'string', 'max:255'],
         'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
         'password' => ['required', 'confirmed', Rules\Password::defaults()]
      ]);

      if ($validator->fails()) {
         return response()->json(['error' => $validator->errors()], 422);
      }

      $user = User::create([
         'name' => $request->name,
         'lastname' => $request->lastname,
         'email' => $request->email,
         'password' => password_hash($request->password, PASSWORD_BCRYPT)
      ]);

      event(new Registered($user));

      return response()->json($user);
   }

   /**
    * Check if user is assignable to the wedding and link them
    * 
    * @param Request $request
    * @param string $code wedding code
    * @return array|WeddingGeneralResource
    */
   public function joinWedding(Request $request, string $code)
   {
      $user = $request->user();

      abort_if($user->is_admin, response()->json(['message' => 'Un administrador no puede participar en una boda'], 400));

      $wedding = Wedding::where('codeGuest', $code)->first();
      if (!$wedding) {
         $wedding = Wedding::where('codeOrg', $code)->first();
         abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

         if ($user->weddings()->withPivot('role_id')->where('role_id', 1)->count() !== 0) {
            abort(response()->json(['message' => 'Ya estás organizando una boda'], 400));
         }
         if ($user->weddings()->withPivot('role_id')->whereIn('role_id', [2, 3])->pluck('wedding_id')->first() === $wedding->id) {
            abort(response()->json(['message' => 'Ya eres invitado de esta boda'], 400));
         }

         $role = 1;
      } else {
         if ($user->weddings()->withPivot('role_id')->where('role_id', 1)->pluck('wedding_id')->first() === $wedding->id) {
            abort(response()->json(['message' => 'No puedes ser invitado de tu propia boda'], 400));
         }

         $role = 2;
         $wedding->increment('numGuests');
      }

      $bus = $wedding->bus ? 0 : null;
      $prewedding = $wedding->prewedding ? 0 : null;
      $wedding->users()->attach($user->id, ['role_id' => $role, 'bus' => $bus, 'prewedding' => $prewedding]);

      return new WeddingGeneralResource($wedding);
   }

   /**
    * Get user role in specific wedding
    *
    * @param Request $request
    * @param int $idWedding
    * @return array
    */
   public function roleWedding(Request $request, int $idWedding)
   {
      $user = $request->user();

      if ($user->is_admin) {
         return ['data' => 'admin'];
      }

      $wedding = $user->weddings()->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $role_id = $wedding->pivot->role_id;
      $role = DB::table('roles')->where('id', $role_id)->value('name');

      return ['data' => $role];
   }

   /**
    * Get weddings by user
    */
   public function weddings(Request $request)
   {
      $user = $request->user();

      $weddings = $user->weddings()->withPivot('role_id')->whereIn('role_id', [2, 3])->get();
      return WeddingUserResource::collection($weddings);
   }

   /**
    * Check if code is a guest code
    */
   public function existsCodeGuest(string $code)
   {
      $wedding = Wedding::where('codeGuest', $code)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      return ['id' => $wedding->id];
   }

   /**
    * Check if code is a organizer code
    */
   public function existsCodeOrg(string $code)
   {
      $wedding = Wedding::where('codeOrg', $code)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      return ['id' => $wedding->id];
   }

   /**
    * Check if user is admin
    */
   public function isAdmin(Request $request)
   {
      return $request->user()->is_admin;
   }
}
