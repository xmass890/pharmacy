import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ sale }) {
    const m = (n) => Number(n).toFixed(2);
    return (
        <AppLayout title={`Invoice ${sale.invoice_no}`}>
            <Head title={sale.invoice_no} />
            <div className="flex gap-3 mb-4 print:hidden">
                <button onClick={() => window.print()} className="bg-emerald-600 text-white px-4 py-2 rounded">🖨 Print</button>
                <Link href={route('sales.create')} className="border px-4 py-2 rounded bg-white">New sale</Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <div className="text-center mb-4">
                    <div className="text-xl font-bold">Pharmacy System</div>
                    <div className="text-sm text-gray-500">Invoice {sale.invoice_no}</div>
                    <div className="text-sm text-gray-500">{new Date(sale.created_at).toLocaleString()}</div>
                </div>
                <div className="text-sm mb-3">
                    Customer: {sale.customer?.name || 'Walk-in'} · Cashier: {sale.user?.name}
                </div>
                <table className="w-full text-sm">
                    <thead className="border-b text-left">
                        <tr><th className="py-1">Item</th><th>Batch</th><th className="text-right">Qty</th><th className="text-right">Price</th><th className="text-right">Total</th></tr>
                    </thead>
                    <tbody>
                        {sale.items.map((i) => (
                            <tr key={i.id} className="border-b">
                                <td className="py-1">{i.medicine?.name}</td>
                                <td>{i.batch?.batch_no}</td>
                                <td className="text-right">{i.quantity}</td>
                                <td className="text-right">{m(i.unit_price)}</td>
                                <td className="text-right">{m(i.line_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 text-sm space-y-1 text-right">
                    <div>Subtotal: {m(sale.subtotal)}</div>
                    <div>Discount: {m(sale.discount)}</div>
                    <div className="text-lg font-bold">Total: {m(sale.total)}</div>
                    <div>Paid ({sale.payment_method}): {m(sale.paid)}</div>
                    <div>Change: {m(Math.max(sale.paid - sale.total, 0))}</div>
                </div>
                <div className="text-center text-xs text-gray-400 mt-6">Thank you. Get well soon!</div>
            </div>
        </AppLayout>
    );
}