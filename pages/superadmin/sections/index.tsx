import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowUp, ArrowDown, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

interface Section {
    id: string;
    title: string;
    type: string;
    order: number;
    isEnabled: boolean;
}

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSections = async () => {
        try {
            const res = await fetch('/api/admin/sections');
            if (res.ok) {
                const data = await res.json();
                setSections(data);
            }
        } catch (error) {
            toast.error('Failed to fetch sections');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/sections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled: !currentStatus }),
            });
            if (res.ok) {
                toast.success('Status updated');
                fetchSections();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return;
        try {
            const res = await fetch(`/api/admin/sections/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Section deleted');
                fetchSections();
            } else {
                toast.error('Failed to delete section');
            }
        } catch (error) {
            toast.error('Error deleting section');
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        } else {
            return;
        }

        // Optimistic update
        setSections(newSections);

        // Prepare batch update
        const updates = newSections.map((s, i) => ({ id: s.id, order: i + 1 }));

        try {
            const res = await fetch('/api/admin/sections', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections: updates }),
            });
            if (!res.ok) {
                toast.error('Failed to save order');
                fetchSections(); // Revert
            }
        } catch (error) {
            toast.error('Error saving order');
            fetchSections(); // Revert
        }
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Home Page Sections</h1>
                    <Link href="/superadmin/sections/new">
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Section
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Sections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Order</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.map((section, index) => (
                                    <TableRow key={section.id}>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    disabled={index === 0}
                                                    onClick={() => handleReorder(index, 'up')}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    disabled={index === sections.length - 1}
                                                    onClick={() => handleReorder(index, 'down')}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{section.title}</TableCell>
                                        <TableCell>{section.type}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStatus(section.id, section.isEnabled)}
                                                className={section.isEnabled ? 'text-green-600' : 'text-gray-400'}
                                            >
                                                {section.isEnabled ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                                                {section.isEnabled ? 'Visible' : 'Hidden'}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/superadmin/sections/${section.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(section.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
