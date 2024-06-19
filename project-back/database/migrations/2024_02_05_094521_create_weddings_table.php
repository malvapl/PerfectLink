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
        Schema::create('weddings', function (Blueprint $table) {
            $table->id();
            $table->string('codeGuest');
            $table->string('codeOrg');
            $table->string('spouse1');
            $table->string('spouse2');
            $table->date('date');
            $table->time('startHour');
            $table->date('maxDateConfirmation')->nullable();
            $table->string('location');
            $table->boolean('ceremony');
            $table->string('locationCeremony')->nullable();
            $table->string('locationParty')->nullable();
            $table->longText('messageGuests')->nullable();
            $table->integer('numGuests');
            $table->boolean('bus');
            $table->boolean('prewedding');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};
