import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ purchases }) {
    const { auth } = usePage().props;
    return (
        <AppLayout title="Purchases">
            <Head title="Purchases" />
            {auth.permissions.includes('purchases.create') && (
                <Link href={route('purchases.create')} className="inline-block mb-4 bg-emerald-600 text-white px-4 py-2 rounded">+ New purchase</Link>
            )}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr><th className="p-3">#</th><th className="p-3">Date</th><th className="p-3">Supplier</th><th className="p-3">Invoice</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Paid</th></tr>
                    </thead>
                    <tbody>
                        {purchases.data.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">{p.id}</td>
                                <td className="p-3">{p.purchase_date?.slice(0, 10)}</td>
                                <td className="p-3">{p.supplier?.name}</td>
                                <td className="p-3">{p.invoice_no}</td>
                                <td className="p-3 text-right">{Number(p.total).toFixed(2)}</td>
                                <td className="p-3 text-right">{Number(p.paid).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={purchases.links} />
        </AppLayout>
    );
}