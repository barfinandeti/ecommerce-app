import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Upload, X, Video, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EditProductPage() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        compareAtPrice: '',
        categoryId: '',
        images: [] as string[],
        videos: [] as string[],
        postalCodes: '' // Comma-separated
    });
    const [slugPreview, setSlugPreview] = useState('');

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlugPreview(slug);
        } else {
            setSlugPreview('');
        }
    }, [formData.title]);

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
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchProduct = async () => {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;
        const session = JSON.parse(sessionData);

        try {
            const res = await fetch(`/api/products/${id}`, {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                const product = await res.json();
                setFormData({
                    title: product.title || '',
                    description: product.description || '',
                    price: product.price ? product.price.toString() : '',
                    compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
                    categoryId: product.categoryId || '',
                    images: product.images || [],
                    videos: product.videos || [],
                    postalCodes: (product.postalCodes || []).join(', ')
                });
            } else {
                toast.error('Failed to fetch product details');
            }
        } catch (error) {
            toast.error('Network error fetching product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setFormData({ ...formData, images: [...formData.images, url] });
        }
    };

    const addVideoUrl = () => {
        const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
        if (url) {
            setFormData({ ...formData, videos: [...formData.videos, url] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) {
            toast.error('Session expired');
            return;
        }
        const session = JSON.parse(sessionData);

        try {
            const postalCodesArray = formData.postalCodes
                .split(',')
                .map(code => code.trim())
                .filter(code => code.length > 0);

            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
                    categoryId: formData.categoryId || null,
                    images: formData.images,
                    videos: formData.videos,
                    postalCodes: postalCodesArray
                })
            });

            if (res.ok) {
                toast.success('Product updated successfully!');
                router.push('/superadmin/products');
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to update product');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SuperAdminLayout>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout>
            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">Update product details.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>Basic information about the product.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Product Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="Elegant Silk Saree"
                                    />
                                    {slugPreview && (
                                        <p className="text-xs text-muted-foreground">
                                            URL: <span className="font-mono text-primary">{slugPreview}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={6}
                                        placeholder="Describe your product..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Upload images and add video links.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Images */}
                                <div className="space-y-2">
                                    <Label>Product Images</Label>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Click to upload images</p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square">
                                                <img src={img} alt="" className="w-full h-full object-cover rounded-lg border" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Videos */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Product Videos</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addVideoUrl}>
                                            + Add Video URL
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.videos.map((video, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                                                <Video className="w-4 h-4 text-muted-foreground" />
                                                <span className="flex-1 text-sm truncate">{video}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, videos: formData.videos.filter((_, i) => i !== idx) })}
                                                    className="text-destructive hover:text-destructive/80"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        placeholder="99.99"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="compareAtPrice">Compare at Price</Label>
                                    <Input
                                        id="compareAtPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.compareAtPrice}
                                        onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                                        placeholder="129.99"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="uncategorized">Uncategorized</SelectItem>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        Postal Codes
                                    </Label>
                                    <Input
                                        value={formData.postalCodes}
                                        onChange={(e) => setFormData({ ...formData, postalCodes: e.target.value })}
                                        placeholder="12345, 67890"
                                    />
                                    <p className="text-xs text-muted-foreground">Comma-separated</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {saving ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </SuperAdminLayout>
    );
}
