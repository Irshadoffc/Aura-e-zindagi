import React, { useState } from 'react';
import {
    Search, Edit2, Globe,
    SquarePen, GitBranchPlus,
} from 'lucide-react';


export default function Pending() {
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [tags, setTags] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('Pakistani Rupee (PKR Rs)');

    if (!showCreateOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <div className="w-32 h-32 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
                            <div className="w-24 h-28 bg-white rounded-lg shadow-md flex items-center justify-center relative">
                                <div className="w-12 h-12 bg-red-400 rounded"></div>
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Manually create orders and invoices
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Use orders to take orders over the phone, email invoices to customers, and collect payments.
                    </p>
                    <button
                        onClick={() => setShowCreateOrder(true)}
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Create order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <SquarePen className="w-5 h-5" />   {/* ← ye tumhara square-pen icon hai */}
                    <span className="text-gray-400">›</span>
                    <h1 className="text-lg font-medium text-gray-900">Create order</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-4">Products</h2>

                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products"
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Browse
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                                    Add custom item
                                </button>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-4">Payment</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-900">Subtotal</span>
                                    <span className="text-sm text-gray-900">Rs 0.00</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-400">Add discount</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-900">—</span>
                                        <span className="text-sm text-gray-900">Rs 0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-400">Add shipping or delivery</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-900">—</span>
                                        <span className="text-sm text-gray-900">Rs 0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">Estimated tax</span>
                                        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                                            <span className="text-xs text-gray-400">i</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-900">Not calculated</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2 pt-3">
                                    <span className="text-sm font-semibold text-gray-900">Total</span>
                                    <span className="text-sm font-semibold text-gray-900">Rs 0.00</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-4">
                                Add a product to calculate total and view payment options
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Notes Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-medium text-gray-900">Notes</h2>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">No notes</p>
                        </div>

                        {/* Customer Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-4">Customer</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search or create a customer"
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Markets Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-medium text-gray-900">Markets</h2>
                                <button className="text-gray-400 hover:text-gray-600">
                                    < GitBranchPlus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-900">Pakistan</span>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-900 mb-2">Currency</label>
                                <div className="relative">
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                                    >
                                        <option>Pakistani Rupee (PKR Rs)</option>
                                        <option>US Dollar (USD $)</option>
                                        <option>Euro (EUR €)</option>
                                    </select>
                                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-medium text-gray-900">Tags</h2>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}