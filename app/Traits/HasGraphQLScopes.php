<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasGraphQLScopes
{
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        $fields = $this->searchable ?? [];

        return $query->where(function (Builder $q) use ($search, $fields) {
            foreach ($fields as $field) {
                if (str_contains($field, '.')) {
                    $parts = explode('.', $field);
                    $fieldName = array_pop($parts); // last part is the actual column
                    $this->applyDeepSearch($q, $parts, $fieldName, $search);
                } else {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            }
        });
    }

    protected function applyDeepSearch($query, $relations, $field, $search): void
    {
        $relation = array_shift($relations);

        $query->orWhereHas($relation, function ($relQuery) use ($relations, $field, $search) {
            if (empty($relations)) {
                // Final level - search field
                $relQuery->where($field, 'like', "%{$search}%");
            } else {
                // Still has nested relations - go deeper
                $this->applyDeepSearch($relQuery, $relations, $field, $search);
            }
        });
    }

    public function scopeSort(Builder $query, ?array $sort): Builder
    {
        if (empty($sort['column']) || empty($sort['direction'])) {
            return $query;
        }

        $column = $sort['column'];
        $direction = strtolower($sort['direction']) === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($column, $direction);
    }

    public function scopeFilter(Builder $query, ?array $filters): Builder
    {
        if (!$filters) {
            return $query;
        }

        $booleanFields = ['is_active', 'is_verified'];

        if (isset($filters['key']) && isset($filters['value'])) {
            $filters = [$filters];
        }

        foreach ($filters as $filter) {
            if (isset($filter['key']) && isset($filter['value'])) {
                $field = $filter['key'];
                $value = $filter['value'];

                if (in_array($field, $booleanFields)) {
                    $query->where($field, $value === 'true' ? 1 : 0);
                } elseif ($value === 'null') {
                    $query->whereNull($field);
                } else {
                    $query->where($field, $value);
                }
            }
        }

        return $query;
    }
}
