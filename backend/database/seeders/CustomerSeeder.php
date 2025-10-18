<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Ahsan Jamil',
                'phone' => '+92-300-1234567',
                'email' => 'ahsan.jamil@example.com',
                'city' => 'Lahore',
                'street_address' => 'Model Town Block A',
                'postal_code' => '54000',
                'total_spent' => 12.50, // USD
                'total_orders' => 5
            ],
            [
                'name' => 'Saad Anjum',
                'phone' => '+92-301-9876543',
                'email' => 'saad.anjum@example.com',
                'city' => 'Lahore',
                'street_address' => 'DHA Phase 5',
                'postal_code' => '54792',
                'total_spent' => 6.43, // USD
                'total_orders' => 3
            ],
            [
                'name' => 'Hira Ahmed',
                'phone' => '+92-302-5555555',
                'email' => 'hira.ahmed@example.com',
                'city' => 'Multan',
                'street_address' => 'Cantt Area',
                'postal_code' => '60000',
                'total_spent' => 7.86, // USD
                'total_orders' => 2
            ],
            [
                'name' => 'Ali Hassan',
                'phone' => '+92-303-7777777',
                'email' => 'ali.hassan@example.com',
                'city' => 'Karachi',
                'street_address' => 'Gulshan-e-Iqbal',
                'postal_code' => '75300',
                'total_spent' => 15.20, // USD
                'total_orders' => 8
            ]
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}