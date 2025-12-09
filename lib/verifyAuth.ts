// Middleware helper to verify admin tokens in API routes
import type { NextApiRequest } from 'next';
import { verifyAdminToken } from './admin-token';
import { supabase } from './supabase';
import prisma from './prisma';

export async function verifyAuth(req: NextApiRequest): Promise<{
    authorized: boolean;
    role?: 'SUPERADMIN' | 'ADMIN' | 'USER';
    organizationId?: string | null;
    userId?: string;
}> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    console.log('🔍 verifyAuth called');
    console.log('   Token present:', !!token);

    if (!token) {
        console.log('   ❌ No token provided');
        return { authorized: false };
    }

    // Try admin token first
    console.log('   Trying admin token verification...');
    const adminAuth = verifyAdminToken(token);

    if (adminAuth) {
        console.log('   ✅ Admin token verified:', adminAuth.email, adminAuth.role);
        // Get full user details from DB
        const user = await prisma.user.findUnique({
            where: { email: adminAuth.email },
            select: { id: true, role: true, organizationId: true }
        });

        if (user) {
            console.log('   ✅ User found in DB:', user.role);
            return {
                authorized: true,
                role: user.role,
                organizationId: user.organizationId,
                userId: user.id
            };
        } else {
            console.log('   ❌ Admin token valid but user not in DB');
        }
    } else {
        console.log('   ⚠️ Admin token verification failed');
    }

    // Fallback to Supabase auth
    console.log('   Trying Supabase auth...');
    try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
        if (error || !authUser) {
            console.log('   ❌ Supabase auth failed:', error?.message);
            return { authorized: false };
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { id: true, role: true, organizationId: true }
        });

        if (dbUser) {
            console.log('   ✅ Supabase user found:', dbUser.role);
            return {
                authorized: true,
                role: dbUser.role,
                organizationId: dbUser.organizationId,
                userId: dbUser.id
            };
        }
    } catch (err) {
        console.log('   ❌ Supabase auth error:', err);
    }

    console.log('   ❌ All auth methods failed');
    return { authorized: false };
}
