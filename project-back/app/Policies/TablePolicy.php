<?php

namespace App\Policies;

use App\Models\Table;
use App\Models\User;

class TablePolicy
{

    /**
     * Admin only
     */
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, Table $table): bool
    {
        return $this->isOrganizerOfWedding($user, $table->wedding_id);
    }

    /**
     * Checked in request
     */
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Table $table): bool
    {
        return $this->isOrganizerOfWedding($user, $table->wedding_id);
    }

    public function delete(User $user, Table $table): bool
    {
        return $this->isOrganizerOfWedding($user, $table->wedding_id);
    }

    /**
     * Check if user is an organizer of the specified wedding.
     */
    private function isOrganizerOfWedding(User $user, int $weddingId): bool
    {
        return $user->weddings()
            ->where('wedding_id', $weddingId)
            ->wherePivot('role_id', 1)
            ->exists();
    }
}
