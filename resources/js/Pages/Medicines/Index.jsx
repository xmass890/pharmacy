import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ medicines, filters }) {
    const { auth } = usePage().props;
    const canManage = auth.permissions.includes('medicines.manage');
    const [search, setSearch] = useState(filters.search || '');

    const submit = (e) => {
        e.preventDefault();
        router.get(route('medicines.index'), { search }, { preserveState: true });
    };

    const remove = (m) => {
        if (confirm(`Delete ${m.name}?`)) router.delete(route('medicines.destroy', m.id));
    };

    return (
        <AppLayout title="Medicines">
            <Head title="Medicines" />
            <div className="flex justify-between mb-4">
                <form onSubmit={submit} className="flex gap-2">
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, generic, barcode"
                        className="border rounded px-3 py-2 w-72" />
                    <button className="bg-gray-700 text-white px-4 rounded">Search</button>
                </form>
                {canManage && (
                    <Link href={route('medicines.create')} className="bg-emerald-600 text-white px-4 py-2 rounded">
                        + Add medicine
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-3">Name</th><th className="p-3">Generic</th>
                            <th className="p-3">Category</th><th className="p-3">Unit</th>
                            <th className="p-3">Stock</th><th className="p-3">Flags</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.data.map((m) => (
                            <tr key={m.id} className="border-t">
                                <td className="p-3 font-medium">{m.name}</td>
                                <td className="p-3">{m.generic_name}</td>
                                <td className="p-3">{m.category?.name}</td>
                                <td className="p-3">{m.unit?.name}</td>
                                <td className={'p-3 font-semibold ' + ((m.stock || 0) <= m.reorder_level ? 'text-red-600' : '')}>
                                    {m.stock || 0}
                                </td>
                                <td className="p-3 space-x-1">
                                    {m.requires_prescription && <span className="bg-blue-100 text-blue-700 px-2 rounded text-xs">Rx</span>}
                                    {m.is_controlled && <span className="bg-red-100 text-red-700 px-2 rounded text-xs">Controlled</span>}
                                </td>
                                <td className="p-3 text-right space-x-3">
                                    {canManage && <>
                                        <Link href={route('medicines.edit', m.id)} className="text-emerald-700">Edit</Link>
                                        <button onClick={() => remove(m)} className="text-red-600">Delete</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                        {medicines.data.length === 0 && (
                            <tr><td colSpan="7" className="p-6 text-center text-gray-500">No medicines found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination links={medicines.links} />
        </AppLayout>
    );
}