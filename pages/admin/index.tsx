import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingBag, DollarSign } from 'lucide-react';

interface DashboardStats {
    products: number;
    orders: number;
    revenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({ products: 0, orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : `₹${stats.revenue.toLocaleString('en-IN')}`}
                        </p>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : stats.orders}
                        </p>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? '...' : stats.products}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Welcome to your Admin Dashboard</h2>
                <p className="text-gray-600">
                    Manage your products and orders from the sidebar. Use the "Products" section to add new items or update existing ones.
                    Check "Orders" to view and manage customer purchases.
                </p>
            </div>
        </AdminLayout>
    );
}
