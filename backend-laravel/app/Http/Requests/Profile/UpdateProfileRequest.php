<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'nomComplet' => 'sometimes|string|max:255',
            'telephone' => [
                'sometimes',
                'string',
                'regex:/^0[567][0-9]{8}$/',
                Rule::unique('users', 'telephone')->ignore($userId),
            ],
            'phone_visible_to_clients' => 'sometimes|boolean',
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
            'telephone.unique' => 'Ce numéro de téléphone est déjà associé à un autre compte.',
            'telephone.regex' => 'Le numéro de téléphone doit être un numéro algérien valide (05/06/07).',
            'lienWhatsApp.regex' => 'Le format doit être wa.me/213XXXXXXXXX avec un numéro algérien valide.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('telephone')) {
            $this->merge([
                'telephone' => $this->normalizeDzPhone($this->input('telephone')),
            ]);
        }
    }

    private function normalizeDzPhone(?string $phone): ?string
    {
        if (!$phone) {
            return $phone;
        }

        $digits = preg_replace('/\D+/', '', $phone);
        if (!$digits) {
            return null;
        }

        if (str_starts_with($digits, '213')) {
            $digits = '0'.substr($digits, 3);
        }

        if (strlen($digits) === 9 && in_array($digits[0], ['5', '6', '7'], true)) {
            $digits = '0'.$digits;
        }

        return $digits;
    }
}
