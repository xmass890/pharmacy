<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Medicine;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Antibiotics', 'Painkillers', 'Vitamins', 'Cough & Cold', 'Diabetes'] as $c) {
            Category::firstOrCreate(['name' => $c]);
        }
        foreach ([['Tablet', 'tab'], ['Capsule', 'cap'], ['Syrup', 'syr'], ['Strip', 'strip'], ['Bottle', 'btl']] as [$n, $s]) {
            Unit::firstOrCreate(['name' => $n], ['short_name' => $s]);
        }

        Medicine::firstOrCreate(['barcode' => '1000001'], [
            'name' => 'Paracetamol 500mg', 'generic_name' => 'Paracetamol',
            'category_id' => Category::where('name', 'Painkillers')->value('id'),
            'unit_id' => Unit::where('name', 'Tablet')->value('id'),
        ]);
        Medicine::firstOrCreate(['barcode' => '1000002'], [
            'name' => 'Amoxicillin 500mg', 'generic_name' => 'Amoxicillin',
            'category_id' => Category::where('name', 'Antibiotics')->value('id'),
            'unit_id' => Unit::where('name', 'Capsule')->value('id'),
            'requires_prescription' => true,
        ]);
    }
}