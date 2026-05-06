<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateInfoWeddingRequest extends FormRequest
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
            'title' => 'required',
            'subtitle' => 'sometimes',
            'description' => 'required',
            'enabled' => 'required|boolean',
            'delete' => 'required|boolean',
        ];
    }
}
