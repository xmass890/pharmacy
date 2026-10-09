import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ customers }) {
    const { errors } = usePage().props;
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [paid, setPaid] = useState('');
    const [method, setMethod] = useState('cash');
    const [customerId, setCustomerId] = useState('');
    const [rx, setRx] = useState(false);
    const [busy, setBusy] = useState(false);

    // Live search (250ms after typing stops)
    useEffect(() => {
        if (!q.trim()) { setResults([]); return; }
        const t = setTimeout(() => {
            window.axios.get(route('sales.search'), { params: { q } }).then((r) => setResults(r.data));
        }, 250);
        return () => clearTimeout(t);
    }, [q]);

    const add = (m) => {
        setCart((c) => {
            const i = c.findIndex((x) => x.id === m.id);
            if (i >= 0) {
                const n = [...c];
                n[i] = { ...n[i], qty: Math.min(n[i].qty + 1, m.stock) };
                return n;
            }
            return [...c, { ...m, qty: 1 }];
        });
        setQ(''); setResults([]);
    };

    // Enter key (barcode scanner): search immediately and add the first match
    const onKeyDown = async (e) => {
        if (e.key !== 'Enter' || !q.trim()) return;
        e.preventDefault();
        const r = await window.axios.get(route('sales.search'), { params: { q } });
        if (r.data[0]) add(r.data[0]);
    };

    const setQty = (id, v) =>
        setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.min(Number(v) || 1, x.stock)) } : x)));
    const remove = (id) => setCart((c) => c.filter((x) => x.id !== id));

    const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
    const total = Math.max(subtotal - (Number(discount) || 0), 0);
    const needsRx = cart.some((i) => i.requires_prescription);

    const submit = () => {
        router.post(route('sales.store'), {
            items: cart.map((i) => ({ medicine_id: i.id, quantity: i.qty })),
            discount: Number(discount) || 0,
            paid: paid === '' ? null : Number(paid),
            payment_method: method,
            customer_id: customerId || null,
            prescription_confirmed: rx,
        }, { onStart: () => setBusy(true), onFinish: () => setBusy(false) });
    };

    return (
        <AppLayout title="New sale (POS)">
            <Head title="POS" />
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
                            placeholder="Search medicine or scan barcode..."
                            className="border-2 border-emerald-500 rounded-lg px-4 py-3 w-full text-lg" />
                        {results.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border rounded-lg shadow mt-1 max-h-72 overflow-y-auto">
                                {results.map((m) => (
                                    <button key={m.id} onClick={() => add(m)}
                                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 flex justify-between border-b">
                                        <span>
                                            {m.name} <span className="text-gray-500 text-sm">{m.generic_name}</span>
                                            {m.requires_prescription && <span className="ml-2 bg-blue-100 text-blue-700 px-2 rounded text-xs">Rx</span>}
                                        </span>
                                        <span className="text-sm">{m.price.toFixed(2)} · stock {m.stock}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr><th className="p-3">Medicine</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3 text-right">Total</th><th></th></tr>
                            </thead>
                            <tbody>
                                {cart.map((i) => (
                                    <tr key={i.id} className="border-t">
                                        <td className="p-3">{i.name}</td>
                                        <td className="p-3">{i.price.toFixed(2)}</td>
                                        <td className="p-3">
                                            <input type="number" min="1" max={i.stock} value={i.qty}
                                                onChange={(e) => setQty(i.id, e.target.value)} className="border rounded w-20 px-2 py-1" />
                                        </td>
                                        <td className="p-3 text-right">{(i.qty * i.price).toFixed(2)}</td>
                                        <td className="p-3"><button onClick={() => remove(i.id)} className="text-red-600">✕</button></td>
                                    </tr>
                                ))}
                                {cart.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">Cart is empty</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 space-y-3 h-fit">
                    <div>
                        <label className="text-sm font-medium">Customer (optional)</label>
                        <select className="border rounded px-2 py-2 w-full" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                            <option value="">Walk-in</option>
                            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Payment method</label>
                        <select className="border rounded px-2 py-2 w-full" value={method} onChange={(e) => setMethod(e.target.value)}>
                            <option value="cash">Cash</option><option value="card">Card</option><option value="mobile">Mobile</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm">Discount</label>
                        <input type="number" step="0.01" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)}
                            className="border rounded px-2 py-1 w-28 text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm">Amount paid</label>
                        <input type="number" step="0.01" min="0" value={paid} placeholder={total.toFixed(2)}
                            onChange={(e) => setPaid(e.target.value)} className="border rounded px-2 py-1 w-28 text-right" />
                    </div>
                    {needsRx && (
                        <label className="flex items-start gap-2 text-sm bg-blue-50 p-2 rounded">
                            <input type="checkbox" checked={rx} onChange={(e) => setRx(e.target.checked)} className="mt-1" />
                            I have verified a valid prescription for the Rx items.
                        </label>
                    )}
                    <div className="border-t pt-3 flex justify-between text-xl font-bold">
                        <span>Total</span><span>{total.toFixed(2)}</span>
                    </div>
                    {Object.values(errors).map((e, i) => <div key={i} className="text-red-600 text-sm">{e}</div>)}
                    <button onClick={submit} disabled={busy || cart.length === 0}
                        className="w-full bg-emerald-600 disabled:bg-gray-300 text-white py-3 rounded-lg text-lg">
                        Complete sale
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}