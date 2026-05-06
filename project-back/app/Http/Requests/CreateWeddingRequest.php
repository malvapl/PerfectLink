<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWeddingRequest extends FormRequest
{
   /**
    * Checked in policy
    */
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      return [
         'spouse1' => 'required|string|max:255',
         'spouse2' => 'required|string|max:255',
         'date' => 'required|after_or_equal:today',
         'startHour' => 'required|string|max:255',
         'location' => 'required|string|max:255',
         'prewedding' => 'required|boolean',
         'bus' => 'required|boolean',
         'ceremony' => 'required|boolean',
      ];
   }
}
