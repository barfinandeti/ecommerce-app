import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Fetch all categories
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });

        // Build tree structure
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        // Initialize map
        categories.forEach((cat: any) => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Populate children
        categories.forEach((cat: any) => {
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children.push(categoryMap.get(cat.id));
                }
            } else {
                rootCategories.push(categoryMap.get(cat.id));
            }
        });

        res.status(200).json(rootCategories);
    } catch (error) {
        console.error('Failed to fetch category tree:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
