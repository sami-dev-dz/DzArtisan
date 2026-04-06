<?php

namespace App\Http\Requests\Intervention;

use Illuminate\Foundation\Http\FormRequest;

class StoreInterventionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->type === 'client';
    }

    public function rules(): array
    {
        return [
            'categorie_id' => 'required|exists:categorie_metiers,id',
            'wilaya_id'    => 'required|exists:wilayas,id',
            'commune_id'   => 'required|exists:communes,id',
            'titre'        => 'required|string|max:255',
            'description'  => 'required|string|max:2000',
            'adresse'      => 'nullable|string|max:255',
            'photos'       => 'nullable|array|max:3',
            'photos.*'     => 'image|max:5120'
        ];
    }
}
