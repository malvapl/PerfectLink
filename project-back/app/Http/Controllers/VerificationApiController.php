<?php

namespace App\Http\Controllers;

use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;

class VerificationApiController extends Controller
{
    public function searchEmail(string $email){
        $emails = User::all()->pluck('email');
        if ($emails->contains($email)){
            return response()->json(['response' => 'yes']);
        }
        return response()->json(['response' => 'no']);
    }

}
