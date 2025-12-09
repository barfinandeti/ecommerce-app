import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Users, Building2, Package, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        organizations: 0,
        users: 0,
        products: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const sessionData = localStorage.getItem('adminSession');
            if (!sessionData) return;

            const session = JSON.parse(sessionData);
            const res = await fetch('/api/superadmin/stats', {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                toast.error('Failed to load dashboard stats');
            }
        } catch (error) {
            toast.error('Network error loading stats');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SuperAdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Superadmin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back! Here's an overview of your platform's performance.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Organizations Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.organizations}</div>
                            <p className="text-xs text-muted-foreground">Active partners</p>
                        </CardContent>
                    </Card>

                    {/* Users Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                            <p className="text-xs text-muted-foreground">Registered accounts</p>
                        </CardContent>
                    </Card>

                    {/* Products Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                            <p className="text-xs text-muted-foreground">Global inventory</p>
                        </CardContent>
                    </Card>

                    {/* Orders Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-pink-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orders}</div>
                            <p className="text-xs text-muted-foreground">Total transactions</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </SuperAdminLayout>
    );
}
