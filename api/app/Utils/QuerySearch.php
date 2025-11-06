<?php

namespace App\Utils;

use Illuminate\Database\Eloquent\Builder;

class QuerySearch
{
    public function __construct(protected Builder $query)
    {
    }

    public static function for(Builder $query): self
    {
        return new static($query);
    }

    public function getQuery(): Builder
    {
        return $this->query;
    }

    public function search(?string $term, array $columns, string $tableAlias = null): self
    {
        if (empty($term)) {
            return $this;
        }

        $normalizedTerm = strtolower(preg_replace('/[^a-z0-9\s]/i', '', $term));
        $words = preg_split('/\s+/', $normalizedTerm, -1, PREG_SPLIT_NO_EMPTY);

        $this->query->where(function ($query) use ($words, $columns, $tableAlias) {
            foreach ($words as $word) {
                $query->where(function ($subQuery) use ($word, $columns, $tableAlias) {
                    foreach ($columns as $column) {
                        if ($this->isRelation($column)) {
                            $this->searchInRelation($subQuery, $column, $word);
                        } else {
                            $fullColumn = $this->getColumnName($column, $tableAlias);
                            $subQuery->orWhereRaw(
                                "regexp_replace(lower({$fullColumn}), '[^a-z0-9]+', '', 'g') ilike ?",
                                ["%{$word}%"]
                            );
                        }
                    }
                });
            }
        });

        return $this;
    }

    private function isRelation(string $column): bool
    {
        return strpos($column, '.') !== false && $this->hasRelationDot($column);
    }

    private function hasRelationDot(string $column): bool
    {
        $parts = explode('.', $column);
        return count($parts) > 2 || !preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $parts[0]);
    }

    private function getColumnName(string $column, string $tableAlias = null): string
    {
        if ($tableAlias) {
            return "{$tableAlias}.{$column}";
        }

        if (strpos($column, '.') !== false) {
            return $column;
        }

        if ($this->query->getModel()) {
            $table = $this->query->getModel()->getTable();
            return "{$table}.{$column}";
        }

        return $column;
    }

    private function searchInRelation($query, string $column, string $term): void
    {
        [$relation, $relationColumn] = explode('.', $column, 2);

        $query->orWhereHas($relation, function ($relationQuery) use ($relationColumn, $term) {
            $relationQuery->where($relationColumn, 'ilike', "%{$term}%");
        });
    }
}
