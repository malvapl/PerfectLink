<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roleOrganizer = Role::create(['name' => 'organizer']);
        $roleGuestPending = Role::create(['name' => 'guestPending']);
        $roleGuestConfirmed = Role::create(['name' => 'guestConfirmed']);
        $roleGuestCanceled = Role::create(['name' => 'guestCanceled']);
        $roleAdmin = Role::create(['name' => 'admin']);

        // $permDelete = Permission::create(['name' => 'delete-wedding', 'guard_name' => 'api']);
        // $permAddTable = Permission::create(['name' => 'post-table', 'guard_name' => 'api']);
        // $permEdit2 = Permission::create(['name' => 'patch-wedding', 'guard_name' => 'api']);
        // $permDeleteTable = Permission::create(['name' => 'delete-table', 'guard_name' => 'api']);

        // $roleAdmin->givePermissionTo($permDelete);
        // $roleOrganizer->givePermissionTo($permAddTable, $permEdit2, $permDeleteTable);

        User::factory(100)->create()->each(function($user) use ($roleGuestPending){
            $user->assignRole($roleGuestPending);
        });

        $organizer = User::factory()->create([
            'name' => 'organizer',
            'email' => 'organizer@educastur.es',
            'password' => bcrypt("Organizer1")
        ]);
        $organizer2 = User::factory()->create([
            'name' => 'organizer2',
            'email' => 'organizer2@educastur.es',
            'password' => bcrypt("Organizer2")
        ]);
        $admin = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@educastur.es',
            'password' => bcrypt("Admin007"),
            'is_admin' => true
        ]);
        $prueba = User::factory()->create([
            'name' => 'prueba',
            'email' => 'prueba@mail.com',
            'password' => bcrypt("asdasdasdA")
        ]);
        $organizer->assignRole($roleOrganizer);
        $organizer2->assignRole($roleOrganizer);
        $admin->assignRole($roleAdmin);

        $this->call(WeddingSeeder::class);

        $this->call(TableSeeder::class);

        $this->call(InfoSeeder::class);
        $this->call(BusSeeder::class);
        $this->call(PreweddingSeeder::class);
    }
}
