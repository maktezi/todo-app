<?php
namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;

class OtpMutator
{
    /**
     * Request OTP for either existing user (login/verify) or new user (registration)
     */
    public function requestOtp($_, array $args): array
    {
        $email = $args['email'] ?? null;
        $userId = $args['user_id'] ?? null;
        $sessionKey = $args['generated_session_key'] ?? Str::uuid()->toString();
        $clientIp = request()->ip();
        $redisKey = "$clientIp:" . ($email ?? $userId) . "-general";

        // Prevent OTP spamming (max 3 attempts within 2 minutes)
        if (Cache::has($redisKey) && Cache::get($redisKey) >= 3) {
            $ttl = Cache::getRedis()->ttl($redisKey);
            return [
                'status' => false,
                'error' => "You cannot request another OTP for another $ttl seconds",
                'expiry' => $ttl,
            ];
        }

        Cache::add($redisKey, 0, now()->addMinutes(2));

        // Generate OTP & hash
        $otp = rand(100000, 999999);
        $secret = env('OTP_SECRET_KEY');
        $hashedOtp = hash_hmac('sha256', $otp, $secret);

        // TEMP DATA TO STORE IN CACHE
        $tempData = [
            'otp' => $hashedOtp,
            'tries' => 1,
            'type' => $userId ? 'existing' : 'registration',
            'user_id' => $userId,
            'email' => $email,
        ];

        // Determine email recipient
        if ($userId) {
            $user = User::findOrFail($userId);
            $sendToEmail = $user->email;
        } else {
            $sendToEmail = $email;
        }

        // Store OTP in cache with TTL (5 minutes)
        Cache::put($sessionKey, json_encode($tempData), now()->addMinutes(5));

        // Send OTP email
        Mail::to($sendToEmail)->send(new \App\Mail\SendOtpMail($otp));

        return [
            'status' => true,
            'remarks' => "OTP has been sent",
            'expiry' => 300,
            'session_key' => $sessionKey,
        ];
    }

    /**
     * Verify OTP
     */
    public function verifyOtp($_, array $args): array
    {
        $sessionKey = $args['generated_session_key'];
        $inputOtp = $args['otp']; // plain OTP
        $clientIp = request()->ip();

        $otpData = Cache::get($sessionKey);
        if (!$otpData) {
            return [
                'status' => false,
                'error' => 'Session expired or invalid',
                'expiry' => 0,
            ];
        }

        $decoded = json_decode($otpData, true);
        $secret = env('OTP_SECRET_KEY');
        $inputHashedOtp = hash_hmac('sha256', $inputOtp, $secret);

        if ($decoded['otp'] === $inputHashedOtp) {
            // ✅ OTP VERIFIED
            Cache::forget($sessionKey);
            Cache::forget("$clientIp:" . ($decoded['email'] ?? $decoded['user_id']) . "-general");

            return [
                'status' => true,
                'remarks' => 'OTP verified successfully',
            ];
        } else {
            // ❌ WRONG OTP
            $decoded['tries'] += 1;

            if ($decoded['tries'] >= 3) {
                Cache::forget($sessionKey);
                return [
                    'status' => false,
                    'error' => 'OTP attempts exceeded, request again',
                ];
            } else {
                $ttl = Cache::getRedis()->ttl($sessionKey);
                Cache::put($sessionKey, json_encode($decoded), now()->addSeconds($ttl));
                return [
                    'status' => false,
                    'error' => 'Incorrect OTP',
                    'expiry' => $ttl,
                ];
            }
        }
    }
}
