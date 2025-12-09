import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth-utils';
import { generateAdminToken } from '@/lib/admin-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                organizationId: true
            }
        });

        console.log('👤 User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('   - Role:', user.role);
            console.log('   - Has password:', user.password ? 'Yes' : 'No');
        }

        if (!user) {
            console.log('❌ No user found with email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user has admin privileges
        if (user.role === 'USER') {
            console.log('❌ User is not admin/superadmin');
            return res.status(403).json({ error: 'Access denied. Admin accounts only.' });
        }

        // Verify password
        if (!user.password) {
            console.log('❌ User has no password set');
            return res.status(401).json({ error: 'Password not set for this account' });
        }

        const isValid = await verifyPassword(password, user.password);
        console.log('🔑 Password valid:', isValid);

        if (!isValid) {
            console.log('❌ Password verification failed');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('✅ Login successful for:', email);

        // Generate admin token
        const token = generateAdminToken(user.email!, user.role);

        // Return success with user info and token
        return res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            token
        });

    } catch (error) {
        console.error('💥 Admin login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


