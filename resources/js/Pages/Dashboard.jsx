import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Card = ({ label, value, color = 'text-gray-800' }) => (
    <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={'text-2xl font-bold ' + color}>{value}</div>
    </div>
);

export default function Dashboard({ stats, chart }) {
    const max = Math.max(...chart.map((c) => c.total), 1);
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card label="Today's sales" value={Number(stats.today_sales).toFixed(2)} color="text-emerald-700" />
                <Card label="Invoices today" value={stats.today_count} />
                <Card label="Medicines" value={stats.medicines} />
                <Card label="Low stock items" value={stats.low_stock} color="text-orange-600" />
                <Card label="Expiring in 90 days" value={stats.expiring} color="text-yellow-600" />
                <Card label="Expired (still in stock)" value={stats.expired} color="text-red-600" />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4">Sales, last 7 days</h2>
                <div className="flex items-end gap-3 h-48">
                    {chart.map((c) => (
                        <div key={c.label} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div className="text-xs mb-1">{c.total.toFixed(0)}</div>
                            <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${(c.total / max) * 100}%`, minHeight: 2 }} />
                            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}