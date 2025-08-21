<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(); // Authenticated user
    }

    public function test_create_task()
    {
        $query = /** @lang GraphQL */ '
            mutation($input: TaskInput!) {
                upsertTask(input: $input) {
                    id
                    title
                    status
                    priority
                    createdBy {
                        id
                    }
                }
            }
        ';

        $variables = [
            'input' => [
                'title' => 'GraphQL Task',
                'description' => 'Created via test',
                'status' => 'PENDING',
                'priority' => 'MEDIUM',
                'createdBy' => ['connect' => $this->user->id],
            ],
        ];

        $response = $this->actingAs($this->user)->postJson('/graphql', [
            'query' => $query,
            'variables' => $variables,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.upsertTask.title', 'GraphQL Task');

        $this->assertDatabaseHas('tasks', ['title' => 'GraphQL Task']);
    }

    public function test_update_task()
    {
        $task = Task::factory()->create([
            'title' => 'Original Title',
            'created_by' => $this->user->id
        ]);

        $query = /** @lang GraphQL */ '
            mutation($input: TaskInput!) {
                upsertTask(input: $input) {
                    id
                    title
                }
            }
        ';

        $variables = [
            'input' => [
                'id' => $task->id,
                'title' => 'Updated Title',
                'updatedBy' => ['connect' => $this->user->id],
            ],
        ];

        $response = $this->actingAs($this->user)->postJson('/graphql', [
            'query' => $query,
            'variables' => $variables,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.upsertTask.title', 'Updated Title');
    }

    public function test_delete_task()
    {
        $task = Task::factory()->create(['created_by' => $this->user->id]);

        $query = /** @lang GraphQL */ '
            mutation($id: [ID!]!) {
                deleteTask(id: $id)
            }
        ';

        $variables = ['id' => [$task->id]];

        $response = $this->actingAs($this->user)->postJson('/graphql', [
            'query' => $query,
            'variables' => $variables,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.deleteTask', true);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

}
