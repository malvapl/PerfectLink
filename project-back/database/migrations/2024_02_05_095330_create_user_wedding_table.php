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
        Schema::create('user_wedding', function (Blueprint $table) {
            $table->foreignId('wedding_id');
            $table->foreign('wedding_id')->references('id')->on('weddings')->onDelete('cascade');
            $table->foreignId('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->primary(['wedding_id', 'user_id']);
            $table->foreignId('role_id');
            $table->foreign('role_id')->references('id')->on('roles');
            $table->boolean('bus')->nullable();
            $table->boolean('prewedding')->nullable();
            $table->enum('group', [
                'Familia de spouse1',
                'Familia de spouse2',
                'Amigos de spouse1',
                'Amigos de spouse2',
                'Trabajo de spouse1',
                'Trabajo de spouse2',
                'Amigos comunes',
                'Otros'
            ])->nullable();
            $table->string('plusOne')->nullable();
            $table->string('infoMenu')->nullable();
            $table->string('suggestion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_wedding');
    }
};
