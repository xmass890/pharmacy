import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

const tabs = [['all', 'All stock'], ['expiring', 'Expiring (90 days)'], ['expired', 'Expired']];

export default function Index({ batches, lowStock, filter }) {
    const { auth } = usePage().props;
    const canAdjust = auth.permissions.includes('inventory.adjust');
    const today = new Date().toISOString().slice(0, 10);

    const writeOff = (b) => {
        if (confirm(`Write off ${b.quantity} units of ${b.medicine.name} (batch ${b.batch_no})?`))
            router.post(route('inventory.writeoff', b.id));
    };

    return (
        <AppLayout title="Inventory">
            <Head title="Inventory" />

            {lowStock.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-orange-800 mb-2">Low stock ({lowStock.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {lowStock.map((m) => (
                            <span key={m.id} className="bg-white border rounded px-2 py-1 text-sm">
                                {m.name}: <b>{m.stock}</b> / {m.reorder_level}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                {tabs.map(([k, l]) => (
                    <Link key={k} href={route('inventory.index', { filter: k })}
                        className={'px-4 py-2 rounded border ' + (filter === k ? 'bg-emerald-600 text-white' : 'bg-white')}>{l}</Link>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr><th className="p-3">Medicine</th><th className="p-3">Batch</th><th className="p-3">Expiry</th><th className="p-3">Qty</th><th className="p-3">Cost</th><th className="p-3">Price</th><th></th></tr>
                    </thead>
                    <tbody>
                        {batches.data.map((b) => {
                            const expired = b.expiry_date.slice(0, 10) < today;
                            return (
                                <tr key={b.id} className={'border-t ' + (expired ? 'bg-red-50' : '')}>
                                    <td className="p-3 font-medium">{b.medicine?.name}</td>
                                    <td className="p-3">{b.batch_no}</td>
                                    <td className={'p-3 ' + (expired ? 'text-red-600 font-semibold' : '')}>{b.expiry_date.slice(0, 10)}</td>
                                    <td className="p-3">{b.quantity}</td>
                                    <td className="p-3">{Number(b.purchase_price).toFixed(2)}</td>
                                    <td className="p-3">{Number(b.selling_price).toFixed(2)}</td>
                                    <td className="p-3">
                                        {expired && canAdjust && (
                                            <button onClick={() => writeOff(b)} className="text-red-600">Write off</button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {batches.data.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-gray-500">Nothing here.</td></tr>}
                    </tbody>
                </table>
            </div>
            <Pagination links={batches.links} />
        </AppLayout>
    );
}