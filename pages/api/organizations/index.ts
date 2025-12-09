import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { generateSlug } from '@/lib/auth-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorized, role, organizationId } = await verifyAuth(req);

    if (!authorized || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // GET - List organizations
    if (req.method === 'GET') {
        try {
            const orgs = await prisma.organization.findMany({
                include: {
                    _count: {
                        select: { users: true, products: true, orders: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(orgs);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch organizations' });
        }
    }

    // POST - Create organization
    if (req.method === 'POST') {
        if (role !== 'SUPERADMIN') {
            return res.status(403).json({ error: 'Only superadmins can create organizations' });
        }

        const {
            name,
            slug,
            businessCategories,
            address,
            gstNumber,
            businessRegistrationCert,
            agreementDocument
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Organization name is required' });
        }

        try {
            const finalSlug = slug || generateSlug(name);

            console.log('Creating organization with data:', { name, finalSlug, businessCategories });

            const org = await prisma.organization.create({
                data: {
                    name,
                    slug: finalSlug,
                    businessCategories: businessCategories || [],
                    address: address || null,
                    gstNumber: gstNumber || null,
                    businessRegistrationCert: businessRegistrationCert || null,
                    agreementDocument: agreementDocument || null
                },
                include: {
                    _count: {
                        select: { users: true, products: true, orders: true }
                    }
                }
            });
            return res.status(201).json(org);
        } catch (error: any) {
            console.error('Create organization error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Slug already exists' });
            }
            return res.status(500).json({ error: 'Failed to create organization', details: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
