import SuperAdminLayout from '@/components/SuperAdminLayout';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, X, Loader2 } from 'lucide-react';
import { generateSlug } from '@/lib/auth-utils';
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Organization {
    id: string;
    name: string;
    slug?: string;
    businessCategories?: string[];
    address?: string;
    gstNumber?: string;
    createdAt: string;
    _count: { users: number; products: number; orders: number };
}

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    const [formData, setFormData] = useState({
        name: '', slug: '', businessCategories: [] as string[], address: '',
        gstNumber: '', businessRegistrationCert: '', agreementDocument: ''
    });
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => { fetchOrganizations(); }, []);

    const fetchOrganizations = async () => {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;
        const session = JSON.parse(sessionData);
        try {
            const res = await fetch('/api/organizations', {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });
            if (res.ok) {
                setOrganizations(await res.json());
            } else {
                toast.error('Failed to fetch organizations');
            }
        } catch (error) {
            toast.error('Network error fetching organizations');
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (name: string) => {
        setFormData({ ...formData, name, slug: generateSlug(name) });
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !formData.businessCategories.includes(newCategory.trim())) {
            setFormData({ ...formData, businessCategories: [...formData.businessCategories, newCategory.trim()] });
            setNewCategory('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;
        const session = JSON.parse(sessionData);
        const url = editingOrg ? `/api/organizations/${editingOrg.id}` : '/api/organizations';

        try {
            const res = await fetch(url, {
                method: editingOrg ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${session.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchOrganizations();
                toast.success(`Organization ${editingOrg ? 'updated' : 'created'} successfully!`);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    const handleEdit = (org: Organization) => {
        setEditingOrg(org);
        setFormData({
            name: org.name, slug: org.slug || '', businessCategories: org.businessCategories || [],
            address: org.address || '', gstNumber: org.gstNumber || '',
            businessRegistrationCert: '', agreementDocument: ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '', businessCategories: [], address: '', gstNumber: '', businessRegistrationCert: '', agreementDocument: '' });
        setEditingOrg(null);
    };

    const handleDelete = async (id: string) => {
        // We'll use a confirm dialog for now, but could upgrade to shadcn Alert Dialog later
        if (!confirm('Delete organization?')) return;
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;
        const session = JSON.parse(sessionData);

        try {
            const res = await fetch(`/api/organizations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.token}` }
            });

            if (res.ok) {
                fetchOrganizations();
                toast.success('Organization deleted successfully');
            } else {
                toast.error('Failed to delete organization');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    return (
        <SuperAdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground">Manage partner organizations and their details.</p>
                </div>
                <Dialog open={showModal} onOpenChange={(open) => {
                    if (!open) resetForm();
                    setShowModal(open);
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" /> Add Organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingOrg ? 'Edit' : 'Add'} Organization</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to {editingOrg ? 'update' : 'create'} an organization.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name *</Label>
                                    <Input id="name" required value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="ABC Fashion Store" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug (Auto-generated)</Label>
                                    <Input id="slug" value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="bg-muted" />
                                    <p className="text-xs text-muted-foreground">URL: /store/{formData.slug}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Business Categories</Label>
                                <div className="flex gap-2">
                                    <Input value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                        placeholder="e.g., Sarees, Lehengas" />
                                    <Button type="button" onClick={handleAddCategory} variant="secondary">
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.businessCategories.map((cat, idx) => (
                                        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                            {cat}
                                            <button type="button" onClick={() => setFormData({ ...formData, businessCategories: formData.businessCategories.filter(c => c !== cat) })}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3} placeholder="Complete business address" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gst">GST Number (Optional)</Label>
                                <Input id="gst" value={formData.gstNumber}
                                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                    placeholder="22AAAAA0000A1Z5" />
                            </div>

                            <div className="border-t pt-4">
                                <Label className="mb-3 block">Documents (Upload Feature - Coming Soon)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex flex-col items-center gap-2">
                                            <Building2 className="w-8 h-8 opacity-50" />
                                            <span>Business Registration</span>
                                        </div>
                                    </div>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex flex-col items-center gap-2">
                                            <Building2 className="w-8 h-8 opacity-50" />
                                            <span>Partnership Agreement</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">{editingOrg ? 'Update' : 'Create'} Organization</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Organizations</CardTitle>
                        <CardDescription>A list of all registered organizations and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead>GST</TableHead>
                                    <TableHead>Stats</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organizations.map((org) => (
                                    <TableRow key={org.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <Building2 className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{org.name}</p>
                                                    {org.slug && <p className="text-xs text-muted-foreground">/{org.slug}</p>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {org.businessCategories?.slice(0, 2).map((cat, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs font-normal">{cat}</Badge>
                                                ))}
                                                {(org.businessCategories?.length || 0) > 2 && (
                                                    <span className="text-xs text-muted-foreground">+{org.businessCategories!.length - 2}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{org.gstNumber || '-'}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {org._count.users} users • {org._count.products} products
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(org)}>
                                                    <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(org.id)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </SuperAdminLayout>
    );
}
