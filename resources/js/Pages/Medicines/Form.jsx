import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        {children}
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
);
const input = 'border rounded px-3 py-2 w-full';

export default function Form({ medicine, categories, units }) {
    const editing = !!medicine;
    const { data, setData, post, put, processing, errors } = useForm({
        name: medicine?.name || '',
        generic_name: medicine?.generic_name || '',
        barcode: medicine?.barcode || '',
        category_id: medicine?.category_id || '',
        unit_id: medicine?.unit_id || '',
        reorder_level: medicine?.reorder_level ?? 10,
        requires_prescription: medicine?.requires_prescription || false,
        is_controlled: medicine?.is_controlled || false,
        is_active: medicine?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        editing ? put(route('medicines.update', medicine.id)) : post(route('medicines.store'));
    };

    return (
        <AppLayout title={editing ? 'Edit medicine' : 'Add medicine'}>
            <Head title="Medicine" />
            <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 max-w-2xl space-y-4">
                <Field label="Name *" error={errors.name}>
                    <input className={input} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </Field>
                <Field label="Generic name" error={errors.generic_name}>
                    <input className={input} value={data.generic_name} onChange={(e) => setData('generic_name', e.target.value)} />
                </Field>
                <Field label="Barcode" error={errors.barcode}>
                    <input className={input} value={data.barcode} onChange={(e) => setData('barcode', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Category" error={errors.category_id}>
                        <select className={input} value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                            <option value="">-- none --</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Unit" error={errors.unit_id}>
                        <select className={input} value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)}>
                            <option value="">-- none --</option>
                            {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </Field>
                </div>
                <Field label="Reorder level (warn when stock is at or below)" error={errors.reorder_level}>
                    <input type="number" min="0" className={input} value={data.reorder_level}
                        onChange={(e) => setData('reorder_level', e.target.value)} />
                </Field>
                <div className="flex gap-6 text-sm">
                    {[['requires_prescription', 'Requires prescription'], ['is_controlled', 'Controlled drug'], ['is_active', 'Active']].map(([k, l]) => (
                        <label key={k} className="flex items-center gap-2">
                            <input type="checkbox" checked={data[k]} onChange={(e) => setData(k, e.target.checked)} /> {l}
                        </label>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button disabled={processing} className="bg-emerald-600 text-white px-5 py-2 rounded">Save</button>
                    <Link href={route('medicines.index')} className="px-5 py-2 rounded border">Cancel</Link>
                </div>
            </form>
        </AppLayout>
    );
}