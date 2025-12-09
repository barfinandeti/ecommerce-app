import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Loader2, Tag } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    organization?: { name: string };
    _count?: { products: number };
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
            setCategories(await res.json());
        }
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsCreating(true);
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newCategoryName })
        });

        if (res.ok) {
            setNewCategoryName('');
            fetchCategories();
        }
        setIsCreating(false);
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: editName })
        });

        if (res.ok) {
            setEditingId(null);
            setEditName('');
            fetchCategories();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Products in this category will be uncategorized.')) return;

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });

        if (res.ok) {
            fetchCategories();
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Product Categories</h1>
                    <p className="text-gray-600">Organize your products into categories</p>
                </div>
            </div>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-bold mb-4">Add New Category</h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category Name (e.g., Sarees, Lehengas)"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center disabled:opacity-50"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create
                    </button>
                </form>
                <p className="text-sm text-gray-500 mt-2">
                    URL-friendly slug will be generated automatically
                </p>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-600 mx-auto" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Slug</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Products</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {editingId === category.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-pink-50 p-2 rounded-full">
                                                    <Tag className="w-4 h-4 text-pink-600" />
                                                </div>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {category._count?.products || 0} products
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {editingId === category.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(category.id)}
                                                        className="text-green-600 hover:text-green-700 px-2 py-1 text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setEditName('');
                                                        }}
                                                        className="text-gray-600 hover:text-gray-700 px-2 py-1 text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(category.id);
                                                            setEditName(category.name);
                                                        }}
                                                        className="text-gray-400 hover:text-pink-600 transition-colors p-2"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {categories.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No categories yet. Create one above!
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
