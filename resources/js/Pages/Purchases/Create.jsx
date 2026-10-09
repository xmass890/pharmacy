import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const blank = { medicine_id: '', batch_no: '', expiry_date: '', quantity: 1, purchase_price: '', selling_price: '' };
const inp = 'border rounded px-2 py-1 w-full text-sm';

export default function Create({ suppliers, medicines }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '', purchase_date: new Date().toISOString().slice(0, 10),
        invoice_no: '', discount: 0, paid: 0, note: '', items: [{ ...blank }],
    });

    const setItem = (i, k, v) => {
        const items = [...data.items];
        items[i] = { ...items[i], [k]: v };
        setData('items', items);
    };
    const addRow = () => setData('items', [...data.items, { ...blank }]);
    const removeRow = (i) => setData('items', data.items.filter((_, x) => x !== i));

    const subtotal = data.items.reduce((s, r) => s + (Number(r.quantity) || 0) * (Number(r.purchase_price) || 0), 0);
    const total = subtotal - (Number(data.discount) || 0);

    const submit = (e) => { e.preventDefault(); post(route('purchases.store')); };

    return (
        <AppLayout title="New purchase">
            <Head title="New purchase" />
            <form onSubmit={submit} className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4 grid md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium">Supplier *</label>
                        <select className={inp} value={data.supplier_id} onChange={(e) => setData('supplier_id', e.target.value)}>
                            <option value="">-- select --</option>
                            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.supplier_id && <div className="text-red-600 text-xs">{errors.supplier_id}</div>}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Date *</label>
                        <input type="date" className={inp} value={data.purchase_date} onChange={(e) => setData('purchase_date', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Supplier invoice no.</label>
                        <input className={inp} value={data.invoice_no} onChange={(e) => setData('invoice_no', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Paid</label>
                        <input type="number" step="0.01" className={inp} value={data.paid} onChange={(e) => setData('paid', e.target.value)} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left">
                            <tr>
                                <th className="p-1">Medicine</th><th className="p-1">Batch no.</th><th className="p-1">Expiry</th>
                                <th className="p-1">Qty</th><th className="p-1">Cost price</th><th className="p-1">Sell price</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((r, i) => (
                                <tr key={i}>
                                    <td className="p-1 min-w-48">
                                        <select className={inp} value={r.medicine_id} onChange={(e) => setItem(i, 'medicine_id', e.target.value)}>
                                            <option value="">-- select --</option>
                                            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-1"><input className={inp} value={r.batch_no} onChange={(e) => setItem(i, 'batch_no', e.target.value)} /></td>
                                    <td className="p-1"><input type="date" className={inp} value={r.expiry_date} onChange={(e) => setItem(i, 'expiry_date', e.target.value)} /></td>
                                    <td className="p-1 w-20"><input type="number" min="1" className={inp} value={r.quantity} onChange={(e) => setItem(i, 'quantity', e.target.value)} /></td>
                                    <td className="p-1 w-28"><input type="number" step="0.01" className={inp} value={r.purchase_price} onChange={(e) => setItem(i, 'purchase_price', e.target.value)} /></td>
                                    <td className="p-1 w-28"><input type="number" step="0.01" className={inp} value={r.selling_price} onChange={(e) => setItem(i, 'selling_price', e.target.value)} /></td>
                                    <td className="p-1">
                                        {data.items.length > 1 && <button type="button" onClick={() => removeRow(i)} className="text-red-600">✕</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {Object.keys(errors).filter((k) => k.startsWith('items')).map((k) => (
                        <div key={k} className="text-red-600 text-xs">{errors[k]}</div>
                    ))}
                    <button type="button" onClick={addRow} className="mt-3 text-emerald-700">+ Add row</button>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Discount</label>
                        <input type="number" step="0.01" className="border rounded px-2 py-1 w-28" value={data.discount}
                            onChange={(e) => setData('discount', e.target.value)} />
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Subtotal {subtotal.toFixed(2)}</div>
                        <div className="text-xl font-bold">Total {total.toFixed(2)}</div>
                    </div>
                </div>

                <button disabled={processing} className="bg-emerald-600 text-white px-6 py-2 rounded">Save purchase</button>
            </form>
        </AppLayout>
    );
}