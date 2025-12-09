import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { verifyAuth } from '@/lib/verifyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify authentication
        const { authorized, role, organizationId } = await verifyAuth(req);

        if (!authorized || (role !== 'SUPERADMIN' && role !== 'ADMIN')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // GET - List users
        if (req.method === 'GET') {
            const where = role === 'SUPERADMIN'
                ? {}
                : { organizationId };

            const users = await prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    name: true,
                    role: true,
                    organizationId: true,
                    organization: { select: { name: true } },
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json(users);
        }

        // POST - Create user
        if (req.method === 'POST') {
            const { email, phone, password, name, role: userRole, organizationId: reqOrgId } = req.body;

            if (!email && !phone) {
                return res.status(400).json({ error: 'Email or phone is required' });
            }

            // Validate role assignment
            if (role === 'ADMIN') {
                // Admins can only create USERs within their org
                if (userRole && userRole !== 'USER') {
                    return res.status(403).json({ error: 'Admins can only create regular users' });
                }
                if (reqOrgId && reqOrgId !== organizationId) {
                    return res.status(403).json({ error: 'Cannot create users for other organizations' });
                }
            }

            // Hash password if provided
            const hashedPassword = password ? await hashPassword(password) : null;

            // Determine target org and role
            const targetOrgId = role === 'ADMIN' ? organizationId : (reqOrgId || null);
            const targetRole = userRole || 'USER';

            const newUser = await prisma.user.create({
                data: {
                    email: email || null,
                    phone: phone || null,
                    password: hashedPassword,
                    name: name || null,
                    role: targetRole,
                    organizationId: targetOrgId
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    name: true,
                    role: true,
                    organizationId: true,
                    organization: { select: { name: true } },
                    createdAt: true
                }
            });

            return res.status(201).json(newUser);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Users API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
