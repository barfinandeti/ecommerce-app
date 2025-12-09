import { PrismaClient } from '@prisma/client';
import { hashPassword } from './lib/auth-utils';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'SUPERADMIN',
            password: hashedPassword
        },
        create: {
            email,
            password: hashedPassword,
            role: 'SUPERADMIN',
            name: 'Super Admin'
        }
    });

    console.log('Superadmin created:', user);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
