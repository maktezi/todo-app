<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class TaskUpdated implements ShouldBroadcastNow
{
    use SerializesModels;

    public function __construct(public array $task) {}

    public function broadcastOn(): Channel
    {
        return new Channel('tasks');
    }

    public function broadcastAs(): string
    {
        return 'TaskUpdated';
    }

    public function broadcastWith(): array
    {
        return ['task' => $this->task];
    }
}
