import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/auth-utils';
import { verifyAuth } from '@/lib/verifyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { authorized, role, organizationId } = await verifyAuth(req);

        if (!authorized) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // GET - List products
        if (req.method === 'GET') {
            const where = role === 'ADMIN' ? { organizationId } : {};

            const products = await prisma.product.findMany({
                where,
                include: {
                    category: { select: { name: true, slug: true } },
                    organization: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json(products);
        }

        // POST - Create product
        if (req.method === 'POST') {
            if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
                return res.status(403).json({ error: 'Access denied' });
            }

            const {
                title,
                description,
                price,
                compareAtPrice,
                images,
                videos,
                postalCodes,
                categoryId
            } = req.body;

            if (!title || price === undefined) {
                return res.status(400).json({ error: 'Title and price are required' });
            }

            const slug = generateSlug(title);
            const targetOrgId = role === 'ADMIN' ? organizationId : null;

            const product = await prisma.product.create({
                data: {
                    title,
                    slug,
                    description: description || null,
                    price: parseFloat(price),
                    compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                    images: images || [],
                    videos: videos || [],
                    postalCodes: postalCodes || [],
                    categoryId: categoryId || null,
                    organizationId: targetOrgId
                },
                include: {
                    category: { select: { name: true, slug: true } },
                    organization: { select: { name: true } }
                }
            });

            return res.status(201).json(product);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Products API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
