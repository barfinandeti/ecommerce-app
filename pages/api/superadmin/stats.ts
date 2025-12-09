import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/admin-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Try to verify as admin token first
        const adminAuth = verifyAdminToken(token);

        if (adminAuth) {
            // Admin token verified
            if (adminAuth.role !== 'SUPERADMIN') {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Fetch global stats
            const [organizationCount, userCount, productCount, orderCount] = await Promise.all([
                prisma.organization.count(),
                prisma.user.count(),
                prisma.product.count(),
                prisma.order.count()
            ]);

            return res.status(200).json({
                organizations: organizationCount,
                users: userCount,
                products: productCount,
                orders: orderCount
            });
        }

        // Fallback to Supabase auth for regular users
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get user details from database
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });

        if (!user || user.role !== 'SUPERADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Fetch global stats
        const [organizationCount, userCount, productCount, orderCount] = await Promise.all([
            prisma.organization.count(),
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count()
        ]);

        return res.status(200).json({
            organizations: organizationCount,
            users: userCount,
            products: productCount,
            orders: orderCount
        });

    } catch (error) {
        console.error('Superadmin stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

