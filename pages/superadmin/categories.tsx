import SuperAdminLayout from '@/components/SuperAdminLayout';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Tag, Save, X } from 'lucide-react';
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
    id: string;
    name: string;
    slug: string;
    organization?: { name: string };
    _count?: { products: number };
}

export default function SuperadminCategoriesPage() {
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
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch('/api/categories', {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });
            if (res.ok) {
                setCategories(await res.json());
            } else {
                toast.error('Failed to fetch categories');
            }
        } catch (error) {
            toast.error('Network error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsCreating(true);
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (res.ok) {
                setNewCategoryName('');
                fetchCategories();
                toast.success('Category created successfully');
            } else {
                toast.error('Failed to create category');
            }
        } catch (error) {
            toast.error('Network error occurred');
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editName })
            });

            if (res.ok) {
                setEditingId(null);
                setEditName('');
                fetchCategories();
                toast.success('Category updated successfully');
            } else {
                toast.error('Failed to update category');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Products in this category will be uncategorized.')) return;

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                fetchCategories();
                toast.success('Category deleted successfully');
            } else {
                toast.error('Failed to delete category');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    return (
        <SuperAdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Categories</h1>
                    <p className="text-muted-foreground">Global category management.</p>
                </div>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Category</CardTitle>
                    <CardDescription>Create a new category for products.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <Input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category Name (e.g., Sarees, Lehengas)"
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isCreating} className="bg-primary hover:bg-primary/90">
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Create
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2">
                        URL-friendly slug will be generated automatically.
                    </p>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Categories List</CardTitle>
                        <CardDescription>Manage existing categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            {editingId === category.id ? (
                                                <Input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    autoFocus
                                                    className="h-8"
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <Tag className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {category.slug}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {category.organization?.name || 'Global'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {category._count?.products || 0} products
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                {editingId === category.id ? (
                                                    <>
                                                        <Button size="sm" variant="ghost" onClick={() => handleUpdate(category.id)} className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                            <Save className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); setEditName(''); }} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button variant="ghost" size="icon" onClick={() => { setEditingId(category.id); setEditName(category.name); }}>
                                                            <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No categories yet. Create one above!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </SuperAdminLayout>
    );
}
