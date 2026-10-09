import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ from, to, daily, top }) {
    const [f, setF] = useState(from);
    const [t, setT] = useState(to);
    const n = (x) => Number(x).toFixed(2);

    const revenue = daily.reduce((s, d) => s + Number(d.revenue), 0);
    const cost = daily.reduce((s, d) => s + Number(d.cost), 0);

    return (
        <AppLayout title="Reports">
            <Head title="Reports" />
            <form onSubmit={(e) => { e.preventDefault(); router.get(route('reports.index'), { from: f, to: t }); }}
                className="flex gap-3 items-end mb-6">
                <div><label className="block text-sm">From</label><input type="date" value={f} onChange={(e) => setF(e.target.value)} className="border rounded px-3 py-2" /></div>
                <div><label className="block text-sm">To</label><input type="date" value={t} onChange={(e) => setT(e.target.value)} className="border rounded px-3 py-2" /></div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded">Apply</button>
            </form>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4"><div className="text-sm text-gray-500">Revenue</div><div className="text-2xl font-bold">{n(revenue)}</div></div>
                <div className="bg-white rounded-lg shadow p-4"><div className="text-sm text-gray-500">Cost of goods</div><div className="text-2xl font-bold">{n(cost)}</div></div>
                <div className="bg-white rounded-lg shadow p-4"><div className="text-sm text-gray-500">Gross profit</div><div className="text-2xl font-bold text-emerald-700">{n(revenue - cost)}</div></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <h2 className="font-semibold p-4">Daily sales</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left"><tr><th className="p-3">Day</th><th className="p-3 text-right">Revenue</th><th className="p-3 text-right">Profit</th></tr></thead>
                        <tbody>
                            {daily.map((d) => (
                                <tr key={d.day} className="border-t">
                                    <td className="p-3">{d.day}</td>
                                    <td className="p-3 text-right">{n(d.revenue)}</td>
                                    <td className="p-3 text-right">{n(d.revenue - d.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <h2 className="font-semibold p-4">Top selling medicines</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left"><tr><th className="p-3">Medicine</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Revenue</th></tr></thead>
                        <tbody>
                            {top.map((r) => (
                                <tr key={r.name} className="border-t">
                                    <td className="p-3">{r.name}</td>
                                    <td className="p-3 text-right">{r.qty}</td>
                                    <td className="p-3 text-right">{n(r.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}