<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBusWeddingRequest extends FormRequest
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
            'id' => 'sometimes|numeric',
            'departure' => 'required|string',
            'direction' => 'required|boolean',
            'deleted' => 'required|boolean',
            'start' => 'required|string|max:255',
            'end' => 'required|string|max:255',
        ];
    }
}
