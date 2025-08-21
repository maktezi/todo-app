<?php

namespace App\Models;

use App\Traits\HasGraphQLScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasGraphQLScopes, HasFactory;

    protected array $searchable = [
        'id',
        'title',
        'description',
    ];

    protected $fillable = [
        'id',
        'created_by',
        'updated_by',
        'title',
        'description',
        'status',
        'priority',
        'order',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
