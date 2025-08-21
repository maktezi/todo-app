<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateOtpSecretKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otp:generate-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a random OTP_SECRET_KEY and update it in the .env file';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $key = Str::random(100);

        $path = base_path('.env');

        if (!file_exists($path)) {
            $this->error('.env file not found!');
            return 1;
        }

        // Read the existing .env
        $env = file_get_contents($path);

        // Replace existing OTP_SECRET_KEY or add it if not present
        if (preg_match('/^OTP_SECRET_KEY=.*$/m', $env)) {
            $env = preg_replace('/^OTP_SECRET_KEY=.*$/m', 'OTP_SECRET_KEY=' . $key, $env);
        } else {
            $env .= "\nOTP_SECRET_KEY=" . $key;
        }

        file_put_contents($path, $env);

        $this->info("✅ OTP_SECRET_KEY generated and saved to .env:");
        $this->line($key);

        return 0;
    }
}
