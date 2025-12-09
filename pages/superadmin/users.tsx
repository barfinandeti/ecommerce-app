import SuperAdminLayout from '@/components/SuperAdminLayout';
import { useState, useEffect } from 'react';
import { User as UserIcon, Shield, Building2, Plus, X, Loader2 } from 'lucide-react';
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    role: 'SUPERADMIN' | 'ADMIN' | 'USER';
    organizationId: string | null;
    organization: { name: string } | null;
    createdAt: string;
}

interface Organization {
    id: string;
    name: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: '',
        password: '',
        role: 'USER',
        organizationId: 'none'
    });

    const fetchData = async () => {
        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        const headers = { 'Authorization': `Bearer ${session.token}` };

        try {
            const [usersRes, orgsRes] = await Promise.all([
                fetch('/api/users', { headers }),
                fetch('/api/organizations', { headers })
            ]);

            if (usersRes.ok && orgsRes.ok) {
                setUsers(await usersRes.json());
                setOrganizations(await orgsRes.json());
            } else {
                toast.error('Failed to fetch data');
            }
        } catch (error) {
            toast.error('Network error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return;

        const session = JSON.parse(sessionData);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowCreateModal(false);
                setFormData({ email: '', phone: '', name: '', password: '', role: 'USER', organizationId: 'none' });
                fetchData();
                toast.success('User created successfully');
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Network error occurred');
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">Superadmin</Badge>;
            case 'ADMIN':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Admin</Badge>;
            default:
                return <Badge variant="secondary">User</Badge>;
        }
    };

    return (
        <SuperAdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage system users and their roles.</p>
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>Add a new user to the system.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">User</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="org">Organization</Label>
                                <Select value={formData.organizationId} onValueChange={(val) => setFormData({ ...formData, organizationId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Organization</SelectItem>
                                        {organizations.map(org => (
                                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit">Create User</Button>
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
                        <CardTitle>Users List</CardTitle>
                        <CardDescription>A directory of all registered users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Organization</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <UserIcon className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{user.name || user.email || user.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {user.email || user.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role)}
                                        </TableCell>
                                        <TableCell>
                                            {user.organization ? (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                                    <span>{user.organization.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm italic">No organization</span>
                                            )}
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
