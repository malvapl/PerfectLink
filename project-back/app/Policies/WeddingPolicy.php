<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wedding;

class WeddingPolicy
{
    /**
     * Admin only
     */
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    /**
     * Admin, organizer, guestPending, guestConfirmed
     */
    public function view(User $user, Wedding $wedding): bool
    {
        return $user->is_admin || $this->hasWeddingRole($user, $wedding, [1, 2, 3]);
    }

    /**
     * Check if user is already an organizer of another wedding
     */
    public function create(User $user): bool
    {
        return !$user->weddings()
            ->wherePivot('role_id', 1)
            ->exists();
    }

    /**
     * Admin or organizer
     */
    public function update(User $user, Wedding $wedding): bool
    {
        return $user->is_admin || $this->hasWeddingRole($user, $wedding, [1]);
    }

    /**
     * Admin or organizer
     */
    public function delete(User $user, Wedding $wedding): bool
    {
        return $user->is_admin || $this->hasWeddingRole($user, $wedding, [1]);
    }

    /**
     * GuestPending, guestConfirmed
     */
    public function manageInvite(User $user, Wedding $wedding): bool
    {
        return $this->hasWeddingRole($user, $wedding, [2, 3]);
    }

    /**
     * Check if user has any of the specified roles for the wedding.
     */
    private function hasWeddingRole(User $user, Wedding $wedding, array $roleIds): bool
    {
        return $user->weddings()
            ->where('wedding_id', $wedding->id)
            ->whereIn('role_id', $roleIds)
            ->exists();
    }
}
