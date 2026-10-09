import { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ suppliers }) {
    const { auth } = usePage().props;
    const canManage = auth.permissions.includes('suppliers.manage');
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, reset, processing, errors } = useForm({ name: '', phone: '', email: '', address: '' });

    const submit = (e) => {
        e.preventDefault();
        const opts = { onSuccess: () => { reset(); setEditing(null); } };
        editing ? put(route('suppliers.update', editing), opts) : post(route('suppliers.store'), opts);
    };

    const edit = (s) => {
        setEditing(s.id);
        setData({ name: s.name, phone: s.phone || '', email: s.email || '', address: s.address || '' });
    };

    const remove = (s) => confirm(`Delete ${s.name}?`) && router.delete(route('suppliers.destroy', s.id));

    return (
        <AppLayout title="Suppliers">
            <Head title="Suppliers" />
            <div className="grid lg:grid-cols-3 gap-6">
                {canManage && (
                    <form onSubmit={submit} className="bg-white rounded-lg shadow p-4 space-y-3 h-fit">
                        <h2 className="font-semibold">{editing ? 'Edit supplier' : 'Add supplier'}</h2>
                        {['name', 'phone', 'email', 'address'].map((f) => (
                            <div key={f}>
                                <input placeholder={f[0].toUpperCase() + f.slice(1)} value={data[f]}
                                    onChange={(e) => setData(f, e.target.value)} className="border rounded px-3 py-2 w-full" />
                                {errors[f] && <div className="text-red-600 text-xs">{errors[f]}</div>}
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <button disabled={processing} className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
                            {editing && <button type="button" onClick={() => { reset(); setEditing(null); }} className="border px-4 py-2 rounded">Cancel</button>}
                        </div>
                    </form>
                )}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Email</th><th className="p-3"></th></tr>
                            </thead>
                            <tbody>
                                {suppliers.data.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="p-3 font-medium">{s.name}</td>
                                        <td className="p-3">{s.phone}</td>
                                        <td className="p-3">{s.email}</td>
                                        <td className="p-3 text-right space-x-3">
                                            {canManage && <>
                                                <button onClick={() => edit(s)} className="text-emerald-700">Edit</button>
                                                <button onClick={() => remove(s)} className="text-red-600">Delete</button>
                                            </>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={suppliers.links} />
                </div>
            </div>
        </AppLayout>
    );
}