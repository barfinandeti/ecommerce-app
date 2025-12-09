import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Authenticate User
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing authorization token' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

    try {
        // 2. Get User Role & Org
        const dbUser = await prisma.user.findUnique({
            where: { phone: user.phone! }, // Assuming phone auth
        });

        if (!dbUser || !['ADMIN', 'SUPERADMIN'].includes(dbUser.role)) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const organizationId = dbUser.organizationId;
        if (!organizationId) {
            return res.status(400).json({ error: 'User not assigned to an organization' });
        }

        // 3. Fetch Stats Scoped to Organization
        const [productCount, orderCount, revenueResult] = await Promise.all([
            prisma.product.count({
                where: { organizationId },
            }),
            prisma.order.count({
                where: { organizationId },
            }),
            prisma.order.aggregate({
                where: { organizationId },
                _sum: {
                    total: true,
                },
            }),
        ]);

        const revenue = revenueResult._sum.total || 0;

        return res.status(200).json({
            products: productCount,
            orders: orderCount,
            revenue: revenue,
        });

    } catch (err) {
        console.error('Error fetching admin stats:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
