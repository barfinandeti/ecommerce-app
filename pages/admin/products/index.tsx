import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    stock: number; // Note: Schema might not have stock yet, using dummy if needed
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    return (
        <AdminLayout title="Products">
            <div className="flex justify-end mb-6">
                <Link
                    href="/admin/products/new"
                    className="bg-black text-white px-4 py-2 rounded flex items-center hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No products found. Add one to get started.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500 text-sm">Product</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-sm">Category</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-sm">Price</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{product.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category || '-'}</td>
                                    <td className="px-6 py-4">₹{Number(product.price).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/products/${product.id}`} className="text-gray-400 hover:text-black mr-3 inline-block">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
