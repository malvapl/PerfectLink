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

      if ($user->is_admin) {
         return ['error' => 'Un administrador no puede participar en una boda'];
      }

      $wedding = Wedding::where('codeGuest', $code)->first();
      if (!$wedding) {
         $wedding = Wedding::where('codeOrg', $code)->first();
         if (!$wedding) {
            return ['error' => 'Wedding not found'];
         }
         if ($user->weddings()->withPivot('role_id')->where('role_id', 1)->count() !== 0) {
            return ['error' => 'Ya estás organizando una boda'];
         }
         if ($user->weddings()->withPivot('role_id')->whereIn('role_id', [2, 3])->pluck('wedding_id')->first() === $wedding->id) {
            return ['error' => 'Ya eres invitado de esta boda'];
         }

         $role = 1;
      } else {
         if ($user->weddings()->withPivot('role_id')->where('role_id', 1)->pluck('wedding_id')->first() === $wedding->id) {
            return ['error' => 'No puedes ser invitado de tu propia boda'];
         }

         $role = 2;
         $wedding->increment('numGuests');
      }

      $bus = $wedding->bus ? 0 : null;
      $prewedding = $wedding->prewedding ? 0 : null;
      $wedding->users()->attach($id_user, ['role_id' => $role, 'bus' => $bus, 'prewedding' => $prewedding]);

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

      $isAdmin = $user->is_admin;
      $wedding = $user->weddings()->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      if (!$wedding) {
         return ['response' => 'none', 'admin' => $isAdmin];
      }

      $role_id = $wedding->pivot->role_id;
      $role = DB::table('roles')->where('id', $role_id)->value('name');

      return ['response' => $role, 'admin' => $isAdmin];
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

      return !$wedding ? ['error' => 'not found'] : ['id' => $wedding->id];
   }

   /**
    * Check if code is a organizer code
    */
   public function existsCodeOrg(string $code)
   {
      $wedding = Wedding::where('codeOrg', $code)->first();

      return !$wedding ? ['error' => 'not found'] : ['id' => $wedding->id];
   }

   /**
    * Check if user is admin
    */
   public function isAdmin(Request $request)
   {
      return $request->user()->is_admin;
   }
}
