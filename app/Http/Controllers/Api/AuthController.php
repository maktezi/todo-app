<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|max:255',
            'password' => 'required|string|min:8'
        ]);

        $user = User::where('email',$request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'The provided credentials are incorrect'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Account not activated, please contact the administrator'
            ], 403);
        }

        $token = $user->createToken($user->name. 'Auth-Token')->plainTextToken;

        return response()->json([
            'message' => 'Login Successful',
            'token_type' => 'Bearer',
            'token' => $token,
            'user' => $user,
        ],200);
    }

    public function register(Request $request) : JsonResponse
    {
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email|max:255",
            "password" => "required|string|min:8|max:255",
        ]);

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ]);

        if($user){
            $token = $user->createToken($user->name. 'Auth-Token')->plainTextToken;

            return response()->json([
                'message' => 'Login Successful',
                'token_type' => 'Bearer',
                'token' => $token
            ],201);
        }
        else{
            return response()->json([
                'message' => 'Something went wrong! while registration.',
            ],500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

}
