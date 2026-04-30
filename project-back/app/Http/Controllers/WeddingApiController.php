<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBusWeddingRequest;
use App\Http\Requests\CreateInfoWeddingRequest;
use App\Http\Requests\CreateWeddingRequest;
use App\Http\Requests\WeddingUpdateRequest;
use App\Http\Resources\BusResource;
use App\Http\Resources\InfoResource;
use App\Http\Resources\WeddingDetailResource;
use App\Http\Resources\WeddingGeneralResource;
use App\Models\Bus;
use App\Models\Info;
use App\Models\Prewedding;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Str;
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
    * Get general data of all weddings
    */
   public function index(Request $request)
   {
      // $weddings = Wedding::with('users');
      $weddings = Wedding::all();
      return new ResourceCollection(WeddingGeneralResource::collection($weddings));
   }

   /**
    * Get all wedding data
    */
   public function show(string $idWedding)
   {
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);
      return new WeddingDetailResource($wedding);
   }

   /**
    * Get wedding info
    */
   public function getInfo(string $idWedding, Request $request)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para ver esta boda'], 400));
      }

      return new ResourceCollection(InfoResource::collection($wedding->infos()->get()));
   }

   /**
    * Create wedding
    */
   public function store(CreateWeddingRequest $request)
   {
      $user = $request->user();
      $id_user = $user->id;

      abort_if($user->hasOwnWedding() !== 0, response()->json(['message' => 'Ya estás organizando una boda'], 400));

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

      return ['id' => (int) $wedding->id];
   }

   public function getBuses(string $idWedding, Request $request)
   {
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));
      abort_if(!$wedding->bus, response()->json(['message' => 'Buses not found'], 404));

      $buses = Bus::where('wedding_id', $idWedding)->get();

      return new ResourceCollection(BusResource::collection($buses));
   }

   public function getPrewedding(string $idWedding, Request $request)
   {
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $pw = Prewedding::where('wedding_id', $idWedding)->first();
      abort_if(!$pw, response()->json(['message' => 'Prewedding not found'], 404));

      return new PreweddingResource($pw);
   }

   public function update(WeddingUpdateRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = $user->weddings()->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400)); // TODO handle with policies
      }

      $data = $request->all();

      if ($request->hasFile('image')) {
         $img = $request->file('image');
         $nameImg = Uuid::uuid4()->toString() . Str::slug($request->spouse1, '-', $request->spouse1) . '.' . $img->getClientOriginalExtension();
         $rutaimg = Storage::disk('public_assets')->putFileAs('images', $img, $nameImg);
         $data['image'] = $rutaimg;
      }

      return ['success' => (bool) $wedding->update($data)];
   }

   public function updateBus(CreateBusWeddingRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('buses')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $data = $request->all();

      if ($data['deleted']) {
         $bus = Bus::find($data['id']);
         return ['success' => (bool) $bus->delete(), 'message' => 'Bus deleted'];
      }

      if (isset($data['id'])) {
         $bus = Bus::find($data['id']);
         $bus->departure = $data['departure'];
         $bus->direction = $data['direction'];
         $bus->start = $data['start'];
         $bus->end = $data['end'];
         return ['success' => (bool) $bus->save(), 'message' => 'Bus updated'];
      }

      $data['wedding_id'] = $idWedding;
      return ['success' => (bool) Bus::create($data), 'message' => 'Bus created'];
   }

   public function addBus(CreateBusWeddingRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('buses')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $data = $request->all();

      $data['wedding_id'] = $idWedding;
      $bus = Bus::create($data);

      return new BusResource($bus);
   }

   public function updatePrewedding(UpdatePreweddingRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('prewedding')->find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $data = $request->all();

      $pw = Prewedding::where('wedding_id', $idWedding)->first();
      $pw->location = $data['location'];
      $pw->time = $data['time'];
      return ['success' => (bool) $pw->save()];

   }

   public function cancelPrewedding(Request $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $wedding['prewedding'] = false;
      $wedding->save();

      $pw = Prewedding::where('wedding_id', $idWedding)->first();

      return ['success' => (bool) $pw->delete()];
   }

   /**
    * Delete wedding buses
    */
   public function cancelBuses(Request $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::find($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $wedding['bus'] = false;
      $wedding->save();

      $buses = Bus::where('wedding_id', $idWedding)->get();

      $result = true;
      foreach ($buses as $bus) {
         $result &= $bus->delete() ?? false;
      }

      return ['success' => $result];
   }

   /**
    * Add info (custom or not) to the wedding
    */
   public function addInfoCards(CreateInfoWeddingRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('infos')->find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $data = $request->all();

      if (isset($data['subtitle']) && $data['subtitle'] == 'delete' && isset($data['id'])) {
         $info = Info::find($data['id']);
         return ['success' => (bool) $info->delete(), 'message' => 'Card deleted'];
      }

      if (isset($data['id'])) {
         $info = Info::find($data['id']);
         $info->title = $data['title'];
         $info->subtitle = $data['subtitle'];
         $info->description = $data['description'];
         $info->delete = $data['delete'];
         $info->enabled = $data['enabled'];
         return ['success' => (bool) $info->save(), 'message' => 'Card updated'];
      }

      $data['wedding_id'] = $idWedding;
      return ['success' => (bool) Info::create($data), 'message' => 'Card created'];
   }

   public function addInfoCard(CreateInfoWeddingRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('infos')->find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      $data = $request->all();

      $data['wedding_id'] = $idWedding;
      $info = Info::create($data);

      return new InfoResource($info);
   }

   public function destroy(Request $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::find($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para modificar esta boda'], 400));
      }

      return ['success' => (bool) $wedding->delete()];
   }
}
