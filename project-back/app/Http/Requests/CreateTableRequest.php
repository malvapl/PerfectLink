<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTableRequest extends FormRequest
{
    /**
     * Admin or wedding organizer
     */
    public function authorize(): bool
    {
        $weddingId = $this->route('wedding');

        return $this->user()->hasOwnWedding() == $weddingId;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'maxChairs' => 'required|numeric|gte:0',
            'name' => 'required|string|max:255',
        ];
    }
}
