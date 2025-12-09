import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { generateSlug } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid organization ID' });
    }

    const { authorized, role } = await verifyAuth(req);

    if (!authorized || role !== 'SUPERADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // GET - Get single organization
    if (req.method === 'GET') {
        try {
            const org = await prisma.organization.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { users: true, products: true, orders: true }
                    }
                }
            });

            if (!org) {
                return res.status(404).json({ error: 'Organization not found' });
            }

            return res.status(200).json(org);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch organization' });
        }
    }

    // PUT - Update organization
    if (req.method === 'PUT') {
        const {
            name,
            slug,
            businessCategories,
            address,
            gstNumber,
            businessRegistrationCert,
            agreementDocument
        } = req.body;

        try {
            const updateData: any = {};

            if (name) {
                updateData.name = name;
                if (!slug) {
                    updateData.slug = generateSlug(name);
                }
            }
            if (slug) updateData.slug = slug;
            if (businessCategories !== undefined) updateData.businessCategories = businessCategories;
            if (address !== undefined) updateData.address = address || null;
            if (gstNumber !== undefined) updateData.gstNumber = gstNumber || null;
            if (businessRegistrationCert) updateData.businessRegistrationCert = businessRegistrationCert;
            if (agreementDocument) updateData.agreementDocument = agreementDocument;

            const updated = await prisma.organization.update({
                where: { id },
                data: updateData,
                include: {
                    _count: {
                        select: { users: true, products: true, orders: true }
                    }
                }
            });

            return res.status(200).json(updated);
        } catch (error: any) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Slug already exists' });
            }
            return res.status(500).json({ error: 'Failed to update organization' });
        }
    }

    // DELETE - Delete organization
    if (req.method === 'DELETE') {
        try {
            await prisma.organization.delete({
                where: { id }
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete organization' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
