<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePreweddingRequest extends FormRequest
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
            'location' => 'required|string|max:255',
            'time' => 'required|string'
        ];
    }
}
