import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { generateSlug } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid category ID' });
    }

    try {
        const { authorized, role, organizationId } = await verifyAuth(req);

        if (!authorized || (role !== 'SUPERADMIN' && role !== 'ADMIN')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check ownership for admins
        if (role === 'ADMIN') {
            const category = await prisma.category.findUnique({
                where: { id },
                select: { organizationId: true }
            });

            if (!category || category.organizationId !== organizationId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // PUT - Update category
        if (req.method === 'PUT') {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required' });
            }

            const slug = generateSlug(name);

            const updated = await prisma.category.update({
                where: { id },
                data: { name, slug },
                include: {
                    organization: { select: { name: true } },
                    _count: { select: { products: true } }
                }
            });

            return res.status(200).json(updated);
        }

        // DELETE - Delete category
        if (req.method === 'DELETE') {
            await prisma.category.delete({
                where: { id }
            });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Category API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
