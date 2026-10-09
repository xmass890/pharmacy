import { Link, usePage } from '@inertiajs/react';

const nav = [
    { label: 'Dashboard',  route: 'dashboard',       pattern: 'dashboard',   perm: null },
    { label: 'New Sale (POS)', route: 'sales.create', pattern: 'sales.create', perm: 'sales.create' },
    { label: 'Sales',      route: 'sales.index',     pattern: 'sales.index', perm: 'sales.view' },
    { label: 'Medicines',  route: 'medicines.index', pattern: 'medicines.*', perm: 'medicines.view' },
    { label: 'Suppliers',  route: 'suppliers.index', pattern: 'suppliers.*', perm: 'suppliers.view' },
    { label: 'Purchases',  route: 'purchases.index', pattern: 'purchases.*', perm: 'purchases.view' },
    { label: 'Inventory',  route: 'inventory.index', pattern: 'inventory.*', perm: 'inventory.view' },
    { label: 'Reports',    route: 'reports.index',   pattern: 'reports.*',   perm: 'reports.view' },
];

export default function AppLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const can = (p) => !p || auth.permissions.includes(p);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-60 bg-emerald-800 text-white flex flex-col print:hidden">
                <div className="px-5 py-4 text-xl font-bold border-b border-emerald-700">💊 Pharmacy</div>
                <nav className="flex-1 p-3 space-y-1">
                    {nav.filter((n) => can(n.perm)).map((n) => (
                        <Link
                            key={n.route}
                            href={route(n.route)}
                            className={
                                'block rounded px-3 py-2 text-sm ' +
                                (route().current(n.pattern) ? 'bg-emerald-600' : 'hover:bg-emerald-700')
                            }
                        >
                            {n.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-emerald-700 text-sm">
                    <div className="font-medium">{auth.user.name}</div>
                    <div className="text-emerald-200 text-xs mb-2">{auth.roles.join(', ')}</div>
                    <Link href={route('logout')} method="post" as="button" className="text-emerald-100 underline">
                        Log out
                    </Link>
                </div>
            </aside>

            <main className="flex-1 p-6 overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 print:hidden">{title}</h1>
                {flash?.success && (
                    <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2 print:hidden">{flash.success}</div>
                )}
                {children}
            </main>
        </div>
    );
}