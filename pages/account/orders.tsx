import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { Package } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// Dummy data
const MOCK_ORDERS = [
    {
        id: 'ord_123',
        date: '2023-10-15',
        status: 'Delivered',
        total: 8999,
        items: [
            { title: 'Rose Silk Lehenga', quantity: 1, price: 8999 }
        ]
    },
    {
        id: 'ord_124',
        date: '2023-11-02',
        status: 'Processing',
        total: 12499,
        items: [
            { title: 'Emerald Velvet Saree', quantity: 1, price: 12499 }
        ]
    }
];

export default function OrdersPage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUser(session.user);
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    if (loading) return null;

    return (
        <Layout title="My Orders | LUXE">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="mb-6">
                                <p className="text-sm text-gray-500">Welcome back,</p>
                                <p className="font-bold truncate">{user?.user_metadata?.full_name || user?.email}</p>
                            </div>
                            <nav className="space-y-2">
                                <a href="#" className="block text-black font-medium">Orders</a>
                                <a href="#" className="block text-gray-500 hover:text-black">Addresses</a>
                                <a href="#" className="block text-gray-500 hover:text-black">Profile</a>
                                <button
                                    onClick={() => logout()}
                                    className="block text-red-500 hover:text-red-700 mt-4 text-left w-full"
                                >
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <h2 className="text-xl font-bold mb-6">Order History</h2>

                        <div className="space-y-6">
                            {MOCK_ORDERS.map((order) => (
                                <div key={order.id} className="border border-gray-100 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center text-sm">
                                        <div>
                                            <span className="text-gray-500 mr-2">Order Placed:</span>
                                            <span className="font-medium">{order.date}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 mr-2">Total:</span>
                                            <span className="font-medium">₹{order.total.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 mr-2">Order ID:</span>
                                            <span className="font-medium">#{order.id}</span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <Package className="w-5 h-5 text-green-600 mr-2" />
                                            <span className="font-medium text-green-600">{order.status}</span>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <span className="font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
