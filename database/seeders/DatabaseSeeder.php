<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin and System Admin users
        $admin = User::factory()->create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@mail.com',
            'phone' => '09876543210',
            'password' => Hash::make('admin1234'),
            'is_active' => 1,
        ]);

        $sysAdmin = User::factory()->create([
            'first_name' => 'Manager',
            'last_name' => 'Mans',
            'email' => 'manager@mail.com',
            'phone' => '09876543210',
            'password' => Hash::make('manager1234'),
            'is_active' => 1,
        ]);

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $systemAdmin = Role::firstOrCreate(['name' => 'System Administrator']);
        $userRole = Role::firstOrCreate(['name' => 'User']);
        $roles = ['Guest', 'System Administrator'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Define permissions
        $permissions = [
            'view dashboard',

            'view user',
            'create user',
            'edit user',
            'delete user',
            'update user status',

            'view role',
            'create role',
            'edit role',
            'delete role',

            'view permission',
            'create permission',
            'edit permission',
            'delete permission',

            'view document',
            'create document',
            'edit document',
            'delete document',
            'approve document',
            'pending document',
            'release document',
            'revoke document',
        ];

        // Create permissions if not exists
        $permissionMap = [];
        foreach ($permissions as $permissionName) {
            $permissionMap[$permissionName] = Permission::firstOrCreate(['name' => $permissionName]);
        }

        $systemAdmin->syncPermissions(array_map(fn($name) => $permissionMap[$name], $permissions));

        // Assign roles to users
        $admin->assignRole($adminRole);
        $sysAdmin->assignRole($systemAdmin);

        // Create additional users
        $users = User::factory(50)->create();
        $users->each(fn($user) => $user->assignRole($userRole));
        $userRole->syncPermissions([
            'view dashboard',
            'view document',
            'create document',
            'edit document',
            'delete document',
        ]);

        // Assign permissions to roles
        // Permissions for System Administrator (technical admin, full access)
        $systemAdminRole = Role::firstOrCreate(['name' => 'System Administrator']);
        $systemAdminRole->syncPermissions(Permission::all());
    }
}
