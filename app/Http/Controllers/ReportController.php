<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->get('from', now()->startOfMonth()->toDateString());
        $to   = $request->get('to', now()->toDateString());

        $base = fn () => DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereNull('sales.deleted_at')
            ->whereBetween('sales.created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);

        $daily = $base()
            ->selectRaw('DATE(sales.created_at) as day, SUM(sale_items.line_total) as revenue, SUM(sale_items.unit_cost * sale_items.quantity) as cost')
            ->groupBy('day')->orderBy('day')->get();

        $top = $base()
            ->join('medicines', 'medicines.id', '=', 'sale_items.medicine_id')
            ->selectRaw('medicines.name, SUM(sale_items.quantity) as qty, SUM(sale_items.line_total) as revenue')
            ->groupBy('medicines.id', 'medicines.name')
            ->orderByDesc('qty')->limit(10)->get();

        return Inertia::render('Reports/Index', [
            'from'  => $from,
            'to'    => $to,
            'daily' => $daily,
            'top'   => $top,
        ]);
    }
}