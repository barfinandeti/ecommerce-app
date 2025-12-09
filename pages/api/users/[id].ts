import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        // Get user from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true, organizationId: true }
        });

        if (!user || (user.role !== 'SUPERADMIN' && user.role !== 'ADMIN')) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // PUT - Update user
        if (req.method === 'PUT') {
            const { email, phone, password, name, role: newRole, organizationId } = req.body;

            // Check ownership for admins
            if (user.role === 'ADMIN') {
                const targetUser = await prisma.user.findUnique({ where: { id } });
                if (!targetUser || targetUser.organizationId !== user.organizationId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
                // Admins can't change roles or move users to other orgs
                if ((newRole && newRole !== targetUser.role) ||
                    (organizationId && organizationId !== user.organizationId)) {
                    return res.status(403).json({ error: 'Insufficient permissions' });
                }
            }

            const updateData: any = {};
            if (email !== undefined) updateData.email = email;
            if (phone !== undefined) updateData.phone = phone;
            if (name !== undefined) updateData.name = name;
            if (password) updateData.password = await hashPassword(password);
            if (newRole && user.role === 'SUPERADMIN') updateData.role = newRole;
            if (organizationId !== undefined && user.role === 'SUPERADMIN') {
                updateData.organizationId = organizationId;
            }

            const updated = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    name: true,
                    role: true,
                    organizationId: true,
                    organization: { select: { name: true } },
                    createdAt: true
                }
            });

            return res.status(200).json(updated);
        }

        // DELETE - Delete user
        if (req.method === 'DELETE') {
            // Check ownership for admins
            if (user.role === 'ADMIN') {
                const targetUser = await prisma.user.findUnique({ where: { id } });
                if (!targetUser || targetUser.organizationId !== user.organizationId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
                // Admins can't delete other admins
                if (targetUser.role === 'ADMIN' || targetUser.role === 'SUPERADMIN') {
                    return res.status(403).json({ error: 'Cannot delete admin users' });
                }
            }

            await prisma.user.delete({ where: { id } });

            return res.status(200).json({ message: 'User deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('User API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
