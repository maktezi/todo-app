<?php

namespace App\Models;
use App\Traits\HasGraphQLScopes;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends SpatiePermission
{
    // use SoftDeletes;
    use HasGraphQLScopes;

    protected array $searchable = ['id', 'name'];

    protected $fillable = [
        'name',
        'guard_name',
    ];

}
