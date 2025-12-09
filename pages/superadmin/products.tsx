import SuperAdminLayout from '@/components/SuperAdminLayout';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Package, Search } from 'lucide-react';
import Link from 'next/link';
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

interface Product {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    organization?: { name: string };
    category?: { name: string };
    createdAt: string;
}

export default function SuperadminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch('/api/products', {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                setProducts(await res.json());
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            toast.error('Network error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                fetchProducts();
                toast.success('Product deleted successfully');
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.organization?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SuperAdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
                    <p className="text-muted-foreground">Global product management across all organizations.</p>
                </div>
                <Link href="/superadmin/products/new">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search products or organizations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Products List</CardTitle>
                        <CardDescription>Manage your product inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.title} className="w-10 h-10 object-cover rounded-md border" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center border">
                                                        <Package className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{product.title}</p>
                                                    <p className="text-xs text-muted-foreground">{product.slug}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                                                {product.organization?.name || 'No org'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {product.category?.name || 'Uncategorized'}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${Number(product.price).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/superadmin/products/${product.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            {searchTerm ? 'No products found matching your search.' : 'No products available.'}
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
