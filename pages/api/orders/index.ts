import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch user role and organization
    const dbUser = await prisma.user.findUnique({ where: { phone: user.phone! } });

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // If ADMIN, scope to organization
    const orgId = dbUser.role === 'ADMIN' ? dbUser.organizationId : null;

    if (req.method === 'GET') {
        try {
            const where = orgId ? { organizationId: orgId } : {};
            const orders = await prisma.order.findMany({
                where,
                include: {
                    user: { select: { phone: true, email: true } },
                    items: { include: { product: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(orders);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
