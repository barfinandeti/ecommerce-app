import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { generateSlug } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorized, role, organizationId } = await verifyAuth(req);

        if (!authorized || (role !== 'SUPERADMIN' && role !== 'ADMIN')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // GET - List categories
        if (req.method === 'GET') {
            const where = role === 'SUPERADMIN'
                ? {}
                : { organizationId };

            const categories = await prisma.category.findMany({
                where,
                include: {
                    organization: { select: { name: true } },
                    _count: { select: { products: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json(categories);
        }

        // POST - Create category
        if (req.method === 'POST') {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required' });
            }

            const slug = generateSlug(name);
            const targetOrgId = role === 'ADMIN' ? organizationId : null;

            const category = await prisma.category.create({
                data: {
                    name,
                    slug,
                    organizationId: targetOrgId
                },
                include: {
                    organization: { select: { name: true } },
                    _count: { select: { products: true } }
                }
            });

            return res.status(201).json(category);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Categories API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
