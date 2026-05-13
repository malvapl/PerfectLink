<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JoinWeddingRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => 'required|string|max:255',
            'code' => 'required|string|max:5',
        ];
    }
}
