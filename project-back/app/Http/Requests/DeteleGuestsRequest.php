<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeteleGuestsRequest extends FormRequest
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
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|numeric|gte:0'
        ];
    }
}
