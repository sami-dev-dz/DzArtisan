<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomComplet' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'description' => 'sometimes|string|nullable',
            'experience_level' => 'sometimes|string|nullable',
            'anneesExp' => 'sometimes|integer|nullable',
            'categorie_ids' => 'sometimes|array',
            'wilaya_ids' => 'sometimes|array',
            'disponibilite' => 'sometimes|string',
            'photo' => 'sometimes|string|nullable',
            'lienWhatsApp' => [
                'sometimes', 
                'nullable', 
                'string', 
                'regex:/^wa\.me\/213[567][0-9]{8}$/'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'lienWhatsApp.regex' => 'Le format doit être wa.me/213XXXXXXXXX avec un numéro algérien valide.',
        ];
    }
}
