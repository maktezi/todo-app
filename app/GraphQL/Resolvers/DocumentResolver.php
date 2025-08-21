<?php

namespace App\GraphQL\Resolvers;

use App\Models\Document;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;

class DocumentResolver
{
    public function upsertDocument($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): Document
    {
        $input = $args['input'];

        // Auto-map all nested relations that have a `connect`
        foreach ($input as $key => $value) {
            if (is_array($value) && isset($value['connect'])) {
                $snakeKey = Str::snake($key);
                // If it's updatedBy, createdBy, etc. we just use updated_by
                if (str_ends_with($snakeKey, '_by')) {
                    $input[$snakeKey] = $value['connect'];
                } else {
                    $input[$snakeKey . '_id'] = $value['connect'];
                }
                unset($input[$key]);
            }
        }

        $isUpdating = isset($input['id']) && !empty($input['id']);

        if ($isUpdating) {
            $document = Document::find($input['id']);

            if (!$document) {
                throw ValidationException::withMessages(['id' => ['Document not found.']]);
            }

            // Prevent updates if already finalized
            if (in_array($document->status, ['released', 'revoked', 'expired'])) {
                throw ValidationException::withMessages([
                    'status' => [
                        "Cannot update '{$document->status}' document. Only pending or approved can be updated."
                    ]
                ]);
            }

            // Prevent releasing pending docs
            if (($input['status'] ?? null) === 'released' && $document->status === 'pending') {
                throw ValidationException::withMessages(['status' => ['Cannot release a document until it is approved.']]);
            }

            $document->fill($input);
            $document->save();

        } else {
            $input['category'] = 'Document';
            $input['status'] = 'pending';
            $document = Document::create($input);
        }

        return $document;
    }

    public function totalPendingDocuments($_, array $args): int
    {
        return Document::where('status', 'pending')
            ->count();
    }

    public function totalPendingNewToday($_, array $args): int
    {
        $startOfDay = Carbon::now()->startOfDay();
        $endOfDay = Carbon::now()->endOfDay();

        return Document::where('status', 'pending')
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->count();
    }
}
