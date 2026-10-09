<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Sale;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $lowStock = Medicine::withSum('batches as stock', 'quantity')->get()
            ->filter(fn ($m) => ($m->stock ?? 0) <= $m->reorder_level)->count();

        $daily = Sale::selectRaw('DATE(created_at) as d, SUM(total) as t')
            ->where('created_at', '>=', today()->subDays(6))
            ->groupBy('d')->pluck('t', 'd');

        $chart = collect(range(6, 0))->map(function ($i) use ($daily) {
            $day = today()->subDays($i);
            return ['label' => $day->format('D'), 'total' => (float) ($daily[$day->toDateString()] ?? 0)];
        })->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'today_sales'  => (float) Sale::whereDate('created_at', today())->sum('total'),
                'today_count'  => Sale::whereDate('created_at', today())->count(),
                'medicines'    => Medicine::count(),
                'low_stock'    => $lowStock,
                'expiring'     => MedicineBatch::where('quantity', '>', 0)
                    ->whereBetween('expiry_date', [today(), today()->addDays(90)])->count(),
                'expired'      => MedicineBatch::where('quantity', '>', 0)
                    ->whereDate('expiry_date', '<', today())->count(),
            ],
            'chart' => $chart,
        ]);
    }
}