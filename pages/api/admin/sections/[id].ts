import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (auth.role !== 'SUPERADMIN' && auth.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const section = await prisma.section.findUnique({
                where: { id: String(id) },
            });
            if (!section) return res.status(404).json({ message: 'Section not found' });
            res.status(200).json(section);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { title, type, settings, isEnabled, order } = req.body;
            const section = await prisma.section.update({
                where: { id: String(id) },
                data: {
                    title,
                    type,
                    settings,
                    isEnabled,
                    order,
                },
            });
            res.status(200).json(section);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.section.delete({
                where: { id: String(id) },
            });
            res.status(200).json({ message: 'Section deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
