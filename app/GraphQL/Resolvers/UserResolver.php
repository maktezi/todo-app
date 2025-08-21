<?php

namespace App\GraphQL\Resolvers;

use App\Models\User;

class UserResolver
{
    public function permissions(User $user): \Illuminate\Support\Collection
    {
        return $user->getAllPermissions();
    }
}