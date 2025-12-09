import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        // Fetch user profile from Prisma to get the role
        // We assume the Supabase Auth ID matches the Prisma User ID (or we link them via email/phone)
        // Since we are using phone auth, let's try to find by phone
        let dbUser = await prisma.user.findUnique({
            where: { phone: user.phone },
        });

        // If user doesn't exist in Prisma (first login), create them as USER
        if (!dbUser && user.phone) {
            dbUser = await prisma.user.create({
                data: {
                    phone: user.phone,
                    role: 'USER',
                },
            });
        }

        return res.status(200).json({ user: dbUser });
    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
