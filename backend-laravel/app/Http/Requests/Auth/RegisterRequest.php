<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

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
            'email'                 => 'required|string|email|max:255|unique:users',
            'password'              => 'required|string|min:8|confirmed',
            'type'                  => 'sometimes|in:client,artisan',
            'telephone'             => 'required|string|max:20|unique:users,telephone',
        ];
    }

    public function messages(): array
    {
        return [
            'telephone.unique'      => 'Ce numéro de téléphone est déjà associé à un compte.',
        ];
    }
}
