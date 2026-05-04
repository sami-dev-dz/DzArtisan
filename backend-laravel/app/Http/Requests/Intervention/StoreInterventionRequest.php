<?php

namespace App\Http\Requests\Intervention;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

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
            'titre'          => 'required|string|max:255',
            'description'    => 'required|string|max:2000',
            'adresse'        => 'nullable|string|max:255',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'telephone'      => 'required|string|max:20',
            'whatsapp'       => 'nullable|string|max:255',
            'date_souhaitee' => 'nullable|date',
            'photos'         => 'nullable|array|max:3',
            'photos.*'       => 'image|max:5120'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        Log::error('StoreInterventionRequest Validation Failed', $validator->errors()->toArray());
        parent::failedValidation($validator);
    }
}
