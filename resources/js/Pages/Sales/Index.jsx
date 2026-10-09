import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ sales }) {
    return (
        <AppLayout title="Sales">
            <Head title="Sales" />
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr><th className="p-3">Invoice</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Cashier</th><th className="p-3 text-right">Total</th><th></th></tr>
                    </thead>
                    <tbody>
                        {sales.data.map((s) => (
                            <tr key={s.id} className="border-t">
                                <td className="p-3 font-medium">{s.invoice_no}</td>
                                <td className="p-3">{new Date(s.created_at).toLocaleString()}</td>
                                <td className="p-3">{s.customer?.name || 'Walk-in'}</td>
                                <td className="p-3">{s.user?.name}</td>
                                <td className="p-3 text-right">{Number(s.total).toFixed(2)}</td>
                                <td className="p-3"><Link href={route('sales.show', s.id)} className="text-emerald-700">View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={sales.links} />
        </AppLayout>
    );
}