<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('doc_no')->unique();
            $table->string('type'); // e.g., Business
            $table->string('category')->default('document'); // e.g. 'permit', 'certificate'
            $table->dateTime('requested_at')->nullable();
            $table->dateTime('issued_at')->nullable();
            $table->dateTime('valid_until')->nullable();
            $table->enum('status', ['pending', 'approved', 'released', 'expired', 'revoked'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
