<?php

namespace App\Models;

use App\Traits\HasGraphQLScopes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasGraphQLScopes;

    protected array $searchable = [
        'id',
        'doc_no',
    ];

    protected $fillable = [
        'id',
        'created_by',
        'updated_by',
        'doc_no',
        'type',
        'category',
        'requested_at',
        'issued_at',
        'valid_until',
        'status'
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
