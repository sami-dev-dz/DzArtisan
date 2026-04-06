<?php

namespace App\Http\Requests\Intervention;

use Illuminate\Foundation\Http\FormRequest;

class UploadPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->type === 'artisan';
    }

    public function rules(): array
    {
        return [
            'photo' => 'required|image|max:5120',
            'type'  => 'required|in:avant,apres'
        ];
    }
}
