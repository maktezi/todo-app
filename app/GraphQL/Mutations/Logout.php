<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

final class Logout
{
    public function __invoke($rootValue, array $args, $context, $info): array
    {
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('Unauthenticated');
        }

        $user->tokens()->delete();

        return [
            'message' => 'Logged out successfully'
        ];
    }
}
