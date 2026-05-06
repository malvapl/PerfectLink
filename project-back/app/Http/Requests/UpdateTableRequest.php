<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTableRequest extends FormRequest
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
      $method = $this->method();
      if ($method == 'PUT') {
         return [
            'name' => 'required|string|max:255',
            'maxChairs' => 'required|numeric|gte:0',
            'pos_x' => 'required|numeric',
            'pos_y' => 'required|numeric',
            'guests' => 'required|array',
         ];
      } else {
         return [
            'name' => 'sometimes|string|max:255',
            'maxChairs' => 'sometimes|numeric|gte:0',
            'pos_x' => 'sometimes|numeric',
            'pos_y' => 'sometimes|numeric',
            'guests' => 'sometimes|array',
         ];
      }
   }
}
