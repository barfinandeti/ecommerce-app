import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/auth-utils';
import { verifyAuth } from '@/lib/verifyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const { authorized, role, organizationId } = await verifyAuth(req);

    if (!authorized || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // GET - Fetch product
    if (req.method === 'GET') {
        try {
            const product = await prisma.product.findUnique({
                where: { id: String(id) },
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    organization: { select: { id: true, name: true } }
                }
            });

            if (!product) return res.status(404).json({ error: 'Product not found' });

            // Check ownership if ADMIN (Superadmin can see all)
            if (role === 'ADMIN' && organizationId && product.organizationId !== organizationId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            return res.status(200).json(product);
        } catch (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    // PUT - Update product
    if (req.method === 'PUT') {
        const {
            title,
            price,
            description,
            images,
            videos,
            postalCodes,
            categoryId,
            compareAtPrice
        } = req.body;

        try {
            // Verify ownership first
            const existingProduct = await prisma.product.findUnique({ where: { id: String(id) } });
            if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

            // Check ownership if ADMIN
            if (role === 'ADMIN' && organizationId && existingProduct.organizationId !== organizationId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Auto-generate slug if title changed
            const slug = title ? generateSlug(title) : existingProduct.slug;

            const product = await prisma.product.update({
                where: { id: String(id) },
                data: {
                    ...(title && { title, slug }),
                    ...(price !== undefined && { price }),
                    ...(description !== undefined && { description }),
                    ...(images !== undefined && { images }),
                    ...(videos !== undefined && { videos }),
                    ...(postalCodes !== undefined && { postalCodes }),
                    ...(categoryId !== undefined && { categoryId }),
                    ...(compareAtPrice !== undefined && { compareAtPrice })
                },
                include: {
                    category: { select: { name: true } },
                    organization: { select: { name: true } }
                }
            });
            return res.status(200).json(product);
        } catch (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Failed to update product' });
        }
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
        try {
            // Verify ownership first
            const existingProduct = await prisma.product.findUnique({ where: { id: String(id) } });
            if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

            // Check ownership if ADMIN
            if (role === 'ADMIN' && organizationId && existingProduct.organizationId !== organizationId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await prisma.product.delete({
                where: { id: String(id) }
            });
            return res.status(200).json({ message: 'Product deleted' });
        } catch (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

