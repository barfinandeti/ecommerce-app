import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditSectionPage() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'BANNER',
        settings: {} as any,
        isEnabled: true,
        order: 0,
    });

    useEffect(() => {
        if (id) {
            fetchSection();
        }
    }, [id]);

    const fetchSection = async () => {
        try {
            const res = await fetch(`/api/admin/sections/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
            } else {
                toast.error('Failed to fetch section');
            }
        } catch (error) {
            toast.error('Error fetching section');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (value: string) => {
        setFormData({ ...formData, type: value });
    };

    const handleSettingChange = (key: string, value: string) => {
        setFormData({
            ...formData,
            settings: { ...formData.settings, [key]: value },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/sections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success('Section updated successfully');
                router.push('/superadmin/sections');
            } else {
                toast.error('Failed to update section');
            }
        } catch (error) {
            toast.error('Error updating section');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SuperAdminLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout>
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-4">
                    <Link href="/superadmin/sections">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Section Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Section Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Section Type</Label>
                                <Select value={formData.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BANNER">Hero Banner</SelectItem>
                                        <SelectItem value="PRODUCT_GRID">Product Grid</SelectItem>
                                        <SelectItem value="CATEGORY_SHOWCASE">Category Showcase</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dynamic Settings Fields */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold">Settings</h3>

                                {formData.type === 'BANNER' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Banner Image URL</Label>
                                            <Input
                                                value={formData.settings.bannerUrl || ''}
                                                onChange={(e) => handleSettingChange('bannerUrl', e.target.value)}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Heading</Label>
                                            <Input
                                                value={formData.settings.heading || ''}
                                                onChange={(e) => handleSettingChange('heading', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subheading</Label>
                                            <Input
                                                value={formData.settings.subheading || ''}
                                                onChange={(e) => handleSettingChange('subheading', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Button Text</Label>
                                            <Input
                                                value={formData.settings.buttonText || ''}
                                                onChange={(e) => handleSettingChange('buttonText', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Button Link</Label>
                                            <Input
                                                value={formData.settings.buttonLink || ''}
                                                onChange={(e) => handleSettingChange('buttonLink', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.type === 'PRODUCT_GRID' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Filter (e.g., trending, best-sellers)</Label>
                                            <Input
                                                value={formData.settings.filter || ''}
                                                onChange={(e) => handleSettingChange('filter', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Limit (Number of products)</Label>
                                            <Input
                                                type="number"
                                                value={formData.settings.limit || ''}
                                                onChange={(e) => handleSettingChange('limit', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.type === 'CATEGORY_SHOWCASE' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Category Slug</Label>
                                            <Input
                                                value={formData.settings.categorySlug || ''}
                                                onChange={(e) => handleSettingChange('categorySlug', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
