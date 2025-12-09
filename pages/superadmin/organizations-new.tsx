import SuperAdminLayout from '@/components/SuperAdminLayout';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, Search, X } from 'lucide-react';
import { generateSlug } from '@/lib/auth-utils';

interface Organization {
    id: string;
    name: string;
    slug?: string;
    businessCategories?: string[];
    address?: string;
    gstNumber?: string;
    createdAt: string;
    _count: {
        users: number;
        products: number;
        orders: number;
    };
}

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        businessCategories: [] as string[],
        address: '',
        gstNumber: '',
        businessRegistrationCert: '',
        agreementDocument: ''
    });
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        const res = await fetch('/api/organizations', {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        if (res.ok) {
            setOrganizations(await res.json());
        }
        setLoading(false);
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !formData.businessCategories.includes(newCategory.trim())) {
            setFormData({
                ...formData,
                businessCategories: [...formData.businessCategories, newCategory.trim()]
            });
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (category: string) => {
        setFormData({
            ...formData,
            businessCategories: formData.businessCategories.filter(c => c !== category)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        const url = editingOrg ? `/api/organizations/${editingOrg.id}` : '/api/organizations';
        const method = editingOrg ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${session.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setShowModal(false);
            resetForm();
            fetchOrganizations();
        }
    };

    const handleEdit = (org: Organization) => {
        setEditingOrg(org);
        setFormData({
            name: org.name,
            slug: org.slug || '',
            businessCategories: org.businessCategories || [],
            address: org.address || '',
            gstNumber: org.gstNumber || '',
            businessRegistrationCert: '',
            agreementDocument: ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            businessCategories: [],
            address: '',
            gstNumber: '',
            businessRegistrationCert: '',
            agreementDocument: ''
        });
        setEditingOrg(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this organization? All associated data will be removed.')) return;

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        const res = await fetch(`/api/organizations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.token}` }
        });

        if (res.ok) {
            fetchOrganizations();
        }
    };

    return (
        <SuperAdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Organizations</h1>
                    <p className="text-gray-600">Manage all partner organizations</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Organization
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Organization</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Categories</th>
                                <th className="px-6 py-4 font-medium text-gray-500">GST</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Stats</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {organizations.map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-pink-50 p-2 rounded-full">
                                                <Building2 className="w-5 h-5 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{org.name}</p>
                                                {org.slug && <p className="text-sm text-gray-500">/{org.slug}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {org.businessCategories?.slice(0, 2).map((cat, idx) => (
                                                <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                                    {cat}
                                                </span>
                                            ))}
                                            {(org.businessCategories?.length || 0) > 2 && (
                                                <span className="text-xs text-gray-500">+{org.businessCategories!.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {org.gstNumber || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="text-gray-600">
                                            {org._count.users} users • {org._count.products} products
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(org)}
                                                className="text-gray-400 hover:text-pink-600 transition-colors p-2"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(org.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal - will be continued in next message due to length */}
        </SuperAdminLayout>
    );
}
