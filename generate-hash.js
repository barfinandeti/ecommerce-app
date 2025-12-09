// Generate password hash for admin users
// Run: node generate-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    console.log('===============================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('===============================================');
    console.log('\nUse this hash in your SQL:');
    console.log(`'${hash}'`);
    console.log('===============================================');
}

generateHash();
