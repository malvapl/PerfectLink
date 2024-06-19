<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeddingUpdateRequest extends FormRequest
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
         'spouse1' => 'sometimes',
         'spouse2' => 'sometimes',
         'date' => 'sometimes|after_or_equal:today',
         'startHour' => 'sometimes|date_format:H:i',
         'maxConfirmationDate' => 'sometimes|after_or_equal:today|before:date',
         'location' => 'sometimes',
         'locationCeremony' => 'sometimes',
         'locationParty' => 'sometimes',
         'image' => 'sometimes'
      ];
   }
}
