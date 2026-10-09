<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear the permission cache so changes apply immediately
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create all permissions
        $permissions = [
            'medicines.view', 'medicines.manage',
            'suppliers.view', 'suppliers.manage',
            'purchases.view', 'purchases.create',
            'sales.view', 'sales.create',
            'inventory.view', 'inventory.adjust',
            'reports.view', 'users.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Create roles and attach permissions
        Role::firstOrCreate(['name' => 'admin'])
            ->syncPermissions(Permission::all());          // admin can do everything

        Role::firstOrCreate(['name' => 'pharmacist'])->syncPermissions([
            'medicines.view', 'medicines.manage',
            'sales.view', 'sales.create',
            'inventory.view', 'inventory.adjust',
            'reports.view',
        ]);

        Role::firstOrCreate(['name' => 'cashier'])->syncPermissions([
            'medicines.view',
            'sales.view', 'sales.create',
        ]);

        Role::firstOrCreate(['name' => 'store_manager'])->syncPermissions([
            'medicines.view',
            'suppliers.view', 'suppliers.manage',
            'purchases.view', 'purchases.create',
            'inventory.view', 'inventory.adjust',
        ]);

        // 3. Create the first admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@pharmacy.test'],
            ['name' => 'Admin', 'password' => Hash::make('password')]
        );
        $admin->assignRole('admin');
    }
}
