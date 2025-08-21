<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class Login
{
    public function __invoke($_, array $args): array
    {
        $user = User::where('email', $args['email'])->first();

        if (!$user || !Hash::check($args['password'], $user->password)) {
            throw new \Exception('The provided credentials are incorrect');
        }

        if (!$user->is_active) {
            throw new \Exception('Account not activated, please contact the administrator');
        }

        $token = $user->createToken($args['email']. 'Auth-Token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
