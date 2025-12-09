// Simple token generation for admin sessions
import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'super-secret-change-in-production-12345';

export function generateAdminToken(email: string, role: string): string {
    const payload = JSON.stringify({
        email,
        role,
        timestamp: Date.now()
    });

    const signature = crypto
        .createHmac('sha256', SECRET)
        .update(payload)
        .digest('hex');

    return Buffer.from(payload + '.' + signature).toString('base64');
}

export function verifyAdminToken(token: string): { email: string; role: string } | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');

        // Split on the LAST dot to avoid issues with dots in email addresses
        const lastDotIndex = decoded.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return null;
        }

        const payload = decoded.substring(0, lastDotIndex);
        const signature = decoded.substring(lastDotIndex + 1);

        const expectedSignature = crypto
            .createHmac('sha256', SECRET)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSignature) {
            return null;
        }

        const data = JSON.parse(payload);

        // Check if token is expired (24 hours)
        if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            return null;
        }

        return { email: data.email, role: data.role };
    } catch (error) {
        return null;
    }
}
