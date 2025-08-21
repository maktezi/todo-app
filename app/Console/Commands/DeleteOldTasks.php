<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class DeleteOldTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-old-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $thresholdDate = Carbon::now()->subDays(30);

        $oldTasks = Task::where('status', 'completed')
            ->where('created_at', '<', $thresholdDate)
            ->get();

        if ($oldTasks->isEmpty()) {
            $this->info('No old tasks found for deletion.');
            return;
        }

        foreach ($oldTasks as $task) {
            Log::channel('task_deletions')->info("Deleted Task ID {$task->id}, Title: {$task->title}, Created At: {$task->created_at}");
            $task->delete();
        }

        $this->info("Deleted {$oldTasks->count()} task(s) older than 30 days.");
    }
}
