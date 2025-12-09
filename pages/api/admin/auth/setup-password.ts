import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

// SETUP ENDPOINT - Use this to set passwords for test users
// Call: POST /api/admin/auth/setup-password
// Body: { email: "superadmin@test.com", password: "admin123" }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        console.log('Setting password for:', email);
        console.log('Hashed password:', hashedPassword);

        // Update user with hashed password
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            success: true,
            message: `Password set for ${email}`,
            hash: hashedPassword
        });

    } catch (error) {
        console.error('Setup password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
