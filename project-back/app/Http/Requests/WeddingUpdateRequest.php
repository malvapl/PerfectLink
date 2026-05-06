<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeddingUpdateRequest extends FormRequest
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
