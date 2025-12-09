import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Upload, X, Video, MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function NewProductPage() {
    const router = useRouter();
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
    }, []);

    useEffect(() => {
        // Auto-generate slug preview
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
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
            setCategories(await res.json());
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

        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Parse postal codes
            const postalCodesArray = formData.postalCodes
                .split(',')
                .map(code => code.trim())
                .filter(code => code.length > 0);

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
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
                alert('Product created successfully!');
                router.push('/admin/products');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || 'Failed to create product'}`);
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Add New Product</h1>
                <p className="text-gray-600">Create a new product for your store</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Elegant Silk Saree"
                        />
                        {slugPreview && (
                            <p className="text-sm text-gray-500 mt-1">
                                URL: <span className="font-mono text-pink-600">{slugPreview}</span>
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="">Uncategorized</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="99.99"
                        />
                    </div>

                    {/* Compare at Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compare at Price (Optional)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.compareAtPrice}
                            onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="129.99"
                        />
                    </div>

                    {/* Postal Codes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Deliverable Postal Codes
                        </label>
                        <input
                            type="text"
                            value={formData.postalCodes}
                            onChange={(e) => setFormData({ ...formData, postalCodes: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="12345, 67890, 11111"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate with commas</p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Describe your product..."
                        />
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-pink-300 transition-colors">
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Click to upload images</p>
                            </label>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Videos */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Video className="w-4 h-4 inline mr-1" />
                            Product Videos
                        </label>
                        <button
                            type="button"
                            onClick={addVideoUrl}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        >
                            + Add Video URL
                        </button>
                        <div className="mt-3 space-y-2">
                            {formData.videos.map((video, idx) => (
                                <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                                    <Video className="w-4 h-4 text-gray-400" />
                                    <span className="flex-1 text-sm text-gray-700 truncate">{video}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, videos: formData.videos.filter((_, i) => i !== idx) })}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
