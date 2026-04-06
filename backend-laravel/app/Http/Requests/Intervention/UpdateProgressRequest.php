<?php

namespace App\Http\Requests\Intervention;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->type === 'artisan';
    }

    public function rules(): array
    {
        return [
            'statut' => 'required|in:en_cours,terminee,annulee'
        ];
    }
}
