<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255',
            'password'              => 'required|string|min:8|confirmed',
            'type'                  => ['required', Rule::in(['client', 'artisan'])],
            'telephone'             => ['required', 'string', 'regex:/^0[567][0-9]{8}$/'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $type = $this->input('type', $this->input('role'));
        $telephone = $this->normalizeDzPhone($this->input('telephone'));
        $email = strtolower(trim((string) $this->input('email')));

        $this->merge([
            'type' => $type,
            'telephone' => $telephone,
            'email' => $email,
        ]);
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

    public function messages(): array
    {
        return [
            'type.required'         => 'Le type de compte est obligatoire.',
            'type.in'               => 'Le type de compte sélectionné est invalide.',
            'telephone.regex'       => 'Le numéro de téléphone doit être un numéro algérien valide (05/06/07).',
        ];
    }
}
