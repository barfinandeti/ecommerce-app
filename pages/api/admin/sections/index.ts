import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Ensure only admins/superadmins can access
    if (auth.role !== 'SUPERADMIN' && auth.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
        try {
            const sections = await prisma.section.findMany({
                orderBy: { order: 'asc' },
            });
            res.status(200).json(sections);
        } catch (error) {
            console.error('Failed to fetch sections:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { title, type, settings, isEnabled, order } = req.body;

            // If order is not provided, put it at the end
            let newOrder = order;
            if (newOrder === undefined) {
                const lastSection = await prisma.section.findFirst({ orderBy: { order: 'desc' } });
                newOrder = (lastSection?.order || 0) + 1;
            }

            const section = await prisma.section.create({
                data: {
                    title,
                    type,
                    settings,
                    isEnabled: isEnabled ?? true,
                    order: newOrder,
                },
            });
            res.status(201).json(section);
        } catch (error) {
            console.error('Failed to create section:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        // Handle batch reordering
        const { sections } = req.body; // Expects array of { id, order }
        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        try {
            await prisma.$transaction(
                sections.map((s: any) =>
                    prisma.section.update({
                        where: { id: s.id },
                        data: { order: s.order },
                    })
                )
            );
            res.status(200).json({ message: 'Sections reordered successfully' });
        } catch (error) {
            console.error('Failed to reorder sections:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
