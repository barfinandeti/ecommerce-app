import { generateAdminToken } from './lib/admin-token';
// import fetch from 'node-fetch'; // Use built-in fetch

async function main() {
    const email = 'admin@example.com';
    const role = 'SUPERADMIN';
    const token = generateAdminToken(email, role);

    console.log('Generated token:', token);

    const response = await fetch('http://localhost:3000/api/organizations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    console.log('Response status:', response.status);
    if (response.ok) {
        const data = await response.json();
        console.log('Organizations:', data);
    } else {
        const text = await response.text();
        console.log('Error:', text);
    }
}

main().catch(console.error);
