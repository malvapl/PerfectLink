<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBusWeddingRequest extends FormRequest
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
            'id' => 'sometimes|numeric',
            'departure' => 'required|string',
            'direction' => 'required|boolean',
            'deleted' => 'required|boolean',
            'start' => 'required|string|max:255',
            'end' => 'required|string|max:255',
        ];
    }
}
