<?php

namespace App\GraphQL\Resolvers;

use App\Events\TaskUpdated;
use App\Models\Task;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;

class TaskResolver
{
    public function upsertTask($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): Task
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
            $task = Task::find($input['id']);

            if (!$task) {
                throw ValidationException::withMessages(['id' => ['Task not found.']]);
            }

            $task->fill($input);
            $task->save();

        } else {
            $input['status'] = 'pending';
            $task = Task::create($input);
        }

        event(new TaskUpdated([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority,
            'order' => $task->order,
        ]));

        return $task;
    }

    public function deleteTask($_, array $args): bool
    {
        $ids = $args['id'];
        $tasks = Task::whereIn('id', $ids)->get();

        if ($tasks->isEmpty()) {
            throw ValidationException::withMessages(['id' => ['No tasks found.']]);
        }

        foreach ($tasks as $task) {
            event(new TaskUpdated(['id' => $task->id]));
            $task->delete();
        }

        return true;
    }
}
