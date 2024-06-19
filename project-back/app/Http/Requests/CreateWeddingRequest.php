<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWeddingRequest extends FormRequest
{
   /**
    * Determine if the user is authorized to make this request.
    */
   public function authorize(): bool
   {
      return true;
   }

   /**
    * Get the validation rules that apply to the request.
    *
    * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
    */
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
