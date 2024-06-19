<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBusWeddingRequest;
use App\Http\Requests\CreateInfoWeddingRequest;
use App\Http\Requests\CreateTableRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\CreateWeddingRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Requests\WeddingUpdateRequest;
use App\Http\Resources\BusResource;
use App\Http\Resources\GuestResource;
use App\Http\Resources\InfoResource;
use App\Http\Resources\TableResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WeddingDetailResource;
use App\Http\Resources\WeddingDetailResourceInfo;
use App\Http\Resources\WeddingGeneralResource;
use App\Models\Bus;
use App\Models\Info;
use App\Models\Prewedding;
use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use App\Http\Requests\DeteleGuestsRequest;
use App\Http\Requests\UpdatePreweddingRequest;
use App\Http\Resources\PreweddingResource;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Nonstandard\Uuid;

class WeddingApiController extends Controller
{

   private $infos = [
      [
         'title' => 'Alojamiento',
         'subtitle' => '¿Queréis recomendar hoteles por la zona?',
         'description' => 'Algunos hoteles cercanos son...'
      ],
      [
         'title' => 'Zapatos',
         'subtitle' => '¿Habrá cambio de zapatos?',
         'description' => 'Tendremos un cambio de calzado cómodo para que puedas bailar todo lo que quieras.'
      ],
      [
         'title' => 'Código de vestimenta',
         'subtitle' => '¿Tendréis un código específico?',
         'description' => 'El código de vestimenta es formal, pero no necesariamente de etiqueta.'
      ]
   ];

   /**
    * Display a listing of the resource.
    */
   public function index(Request $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }
      // $weddings = Wedding::with('users');
      $weddings = Wedding::all();
      return new ResourceCollection(WeddingGeneralResource::collection($weddings));
   }

   /**
    * Display the specified resource.
    */
   public function show(string $id)
   {
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($id);
      return new WeddingDetailResource($wedding);
   }

   /**
    * Display the specified resource.
    */
   public function getInfo(string $id, Request $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($id);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para ver esta boda"];
      }

      return new ResourceCollection(InfoResource::collection($wedding->infos()->get()));
   }

   /**
    * Store a newly created resource in storage.
    */
   public function store(CreateWeddingRequest $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["error" => "Usuario no logeado"];
      }

      if ($user->hasOwnWedding() !== 0) {
         return ["error" => "Ya estás organizando una boda"];
      }

      $data = $request->all();
      do {
         $codeGuest = generateUniqueCode();
      } while (Wedding::where('codeGuest', $codeGuest)->count() !== 0);

      do {
         $codeOrg = generateUniqueCode();
      } while (Wedding::where('codeOrg', $codeOrg)->count() !== 0);

      $data['codeGuest'] = $codeGuest;
      $data['codeOrg'] = $codeOrg;
      $data['numGuests'] = 0;
      $wedding = Wedding::create($data);
      $wedding->users()->attach($id_user, ['role_id' => 1, 'bus' => null, 'prewedding' => null]);

      foreach ($this->infos as $info) {
         $inf = new Info();
         $inf->title = $info['title'];
         $inf->subtitle = $info['subtitle'];
         $inf->description = $info['description'];
         $inf->enabled = false;
         $inf->delete = false;
         $inf->wedding_id = $wedding->id;
         $inf->save();
      }

      if ($data['prewedding']) {
         $pw = new Prewedding();
         $pw->location = '';
         $pw->time = '';
         $pw->wedding_id = $wedding->id;
         $pw->save();
      }

      return ['id' => $wedding->id];
   }

   public function getBuses(string $idWedding, Request $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);
      if (!$wedding) {
         return ['error' => 'wedding not found'];
      }

      if (!$wedding->bus) {
         return ['data' => 'none'];
      }

      $buses = Bus::where('wedding_id', $idWedding)->get();

      return new ResourceCollection(BusResource::collection($buses));
   }

   public function getPrewedding(string $idWedding, Request $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);
      if (!$wedding) {
         return ['error' => 'wedding not found'];
      }

      $pw = Prewedding::where('wedding_id', $idWedding)->first();
      if (!$pw)
         return ['data' => 'none'];
      return new PreweddingResource($pw);
   }

   /**
    * Update the main info of the wedding
    */
   public function update(WeddingUpdateRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }
      $wedding = $user->weddings()->withPivot('role_id')->where('wedding_id', $idWedding)->first();

      if (!$wedding) {
         return ['error' => 'wedding not found'];
      }

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }
      
      $data = $request->all();

      if ($request->hasFile('image')) {
         $img = $request->file('image');
         $nameImg = Uuid::uuid4()->toString() . Str::slug($request->spouse1, '-', $request->spouse1) . '.' . $img->getClientOriginalExtension();
         $rutaimg = Storage::disk('public_assets')->putFileAs('images', $img, $nameImg);
         $data['image'] = $rutaimg;
      }

      $wedding->update($data);
      return new WeddingGeneralResource($wedding);
   }

   public function updateBus(CreateBusWeddingRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::with('buses')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $data = $request->all();

      if ($data['deleted']) {
         $bus = Bus::find($data['id']);
         $bus->delete();
      } else if (isset($data['id'])) {
         $bus = Bus::find($data['id']);
         $bus->departure = $data['departure'];
         $bus->direction = $data['direction'];
         $bus->start = $data['start'];
         $bus->end = $data['end'];
         $bus->save();
      } else {
         $data['wedding_id'] = $idWedding;
         $bus = Bus::create($data);
      }

      return new ResourceCollection(BusResource::collection($wedding->buses()->get()));
   }

   public function addBus(CreateBusWeddingRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::with('buses')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $data = $request->all();

      $data['wedding_id'] = $idWedding;
      $bus = Bus::create($data);

      return new BusResource($bus);
   }

   public function updatePrewedding(UpdatePreweddingRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::with('prewedding')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $data = $request->all();

      $pw = Prewedding::where('wedding_id', $idWedding)->first();
      $pw->location = $data['location'];
      $pw->time = $data['time'];
      $pw->save();

      return new ResourceCollection(PreweddingResource::collection($wedding->prewedding()->get()));
   }

   public function cancelPrewedding(Request $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $wedding['prewedding'] = false;
      $wedding->save();

      $pw = Prewedding::where('wedding_id', $idWedding)->first();
      $pw->delete();

      return ['data' => 'success'];
   }

   public function cancelBuses(Request $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $wedding['bus'] = false;
      $wedding->save();

      $buses = Bus::where('wedding_id', $idWedding)->get();
      foreach ($buses as $bus) {
         $bus->delete();
      }

      return ['data' => 'success'];
   }

   /**
    * Adds info (custom or not) to the wedding
    */
   public function addInfoCards(CreateInfoWeddingRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::with('infos')->find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $data = $request->all();

      if (isset($data['subtitle']) && $data['subtitle'] == 'delete') {
         if (isset($data['id'])) {
            $info = Info::find($data['id']);
            $info->delete();
         }
      } else if (isset($data['id'])) {
         $info = Info::find($data['id']);
         $info->title = $data['title'];
         $info->subtitle = $data['subtitle'];
         $info->description = $data['description'];
         $info->delete = $data['delete'];
         $info->enabled = $data['enabled'];
         $info->save();
      } else {
         $data['wedding_id'] = $idWedding;
         $info = Info::create($data);
      }

      return new ResourceCollection(InfoResource::collection($wedding->infos()->get()));
   }

   public function addInfoCard(CreateInfoWeddingRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::with('infos')->find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $data = $request->all();

      $data['wedding_id'] = $idWedding;
      $info = Info::create($data);

      return new InfoResource($info);
   }

   /**
    * Remove the specified resource from storage.
    */
   public function destroy(Request $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = Wedding::find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $wedding->delete();
      return ['id' => $wedding->id];
   }
}
