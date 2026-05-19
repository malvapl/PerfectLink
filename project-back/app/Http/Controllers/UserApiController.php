<?php

namespace App\Http\Controllers;

use App\Http\Requests\JoinWeddingRequest;
use App\Http\Resources\WeddingGeneralResource;
use App\Http\Resources\WeddingUserResource;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class UserApiController extends Controller
{

   /**
    * Log in user and check if they own a wedding
    */
   public function login(Request $request)
   {
      $credentials = $request->only('email', 'password');

      abort_if(!Auth::attempt($credentials), 401, 'Unauthorized');

      $user = Auth::user();

      $token = $user->createToken('API Token')->plainTextToken;

      $result = ['token' => $token];

      if ($user->is_admin) {
         return $result;
      }

      $idWedding = $user->hasOwnWedding();
      if ($idWedding !== 0) {
         $result['wedding'] = $idWedding;
      }

      return $result;
   }

   public function register(Request $request)
   {
      $validator = Validator::make($request->all(), [
         'name' => ['required', 'string', 'max:255'],
         'lastname' => ['required', 'string', 'max:255'],
         'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
         'password' => ['required', 'confirmed', Rules\Password::defaults()]
      ]);

      abort_if($validator->fails(), 422, $validator->errors());

      $user = User::create([
         'name' => $request->name,
         'lastname' => $request->lastname,
         'email' => $request->email,
         'password' => Hash::make($request->password)
      ]);

      event(new Registered($user));

      return response()->noContent();
   }

   /**
    * Check if wedding exists for code and if user is assignable to the wedding
    * Then link the user to the wedding and return wedding id
    */
   public function joinWedding(JoinWeddingRequest $request)
   {
      $user = $request->user();
      abort_if($user->is_admin, response()->json(['message' => 'Un administrador no puede participar en una boda'], 400));

      $data = $request->all();

      $wedding = Wedding::where('code' . $data['role'], $data['code'])->first();
      abort_if(!$wedding, response()->json(['message' => 'Boda no encontrada'], 404));

      if (strtolower($data['role']) === 'org') {
         if ($user->hasOwnWedding() !== 0) {
            abort(response()->json(['message' => 'Ya estás organizando una boda'], 400));
         }
         if ($user->weddings()->withPivot('role_id')->whereIn('role_id', [2, 3])->pluck('wedding_id')->first() === $wedding->id) {
            abort(response()->json(['message' => 'Ya eres invitado de esta boda'], 400));
         }

         $role_id = 1;
      } else {
         if ($user->hasOwnWedding() === $wedding->id) {
            abort(response()->json(['message' => 'No puedes ser invitado de tu propia boda'], 400));
         }

         $role_id = 2;
         $wedding->increment('numGuests');
      }

      $bus = $wedding->bus ? 0 : null;
      $prewedding = $wedding->prewedding ? 0 : null;

      $wedding->users()->attach($user->id, ['role_id' => $role_id, 'bus' => $bus, 'prewedding' => $prewedding]);

      return ['data' => ['id' => $wedding->id]];
   }

   /**
    * Get user role in specific wedding
    */
   public function roleWedding(Request $request, int $idWedding)
   {
      $user = $request->user();

      if ($user->is_admin) {
         return ['data' => 'admin'];
      }

      $wedding = $user->weddings()->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      abort_if(!$wedding, response()->json(['message' => 'Boda no encontrada'], 404));

      $role_id = $wedding->pivot->role_id;
      $role = DB::table('roles')->where('id', $role_id)->value('name');

      return ['data' => $role];
   }

   /**
    * Get weddings by user
    */
   public function weddings(Request $request)
   {
      $weddings = $request->user()->weddings()->withPivot('role_id')->whereIn('role_id', [2, 3])->get();

      return WeddingUserResource::collection($weddings);
   }

   /**
    * Check if user is admin
    */
   public function isAdmin(Request $request)
   {
      return $request->user()->is_admin;
   }
}
