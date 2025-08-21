<?php

namespace App\Console\Commands;

use App\Models\Document;
use Illuminate\Console\Command;

class UpdateExpiredPermits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permits:expire-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark permits as expired if their valid_until date has passed';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        // Expire permits with past valid_until dates
        $expiredCount = Document::where('status', 'active')
            ->whereNotNull('valid_until')
            ->where('valid_until', '<', now())
            ->update(['status' => 'expired']);

        // Reactivate permits with future valid_until dates
        $reactivatedCount = Document::where('status', '!=', 'active')
            ->whereNotNull('valid_until')
            ->where('valid_until', '>=', now())
            ->update(['status' => 'active']);

        $this->info("Updated $expiredCount expired permits.");
        $this->info("Updated $reactivatedCount reactivated permits.");
    }
}
