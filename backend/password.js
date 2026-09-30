const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function resetPasswords() {
  try {
    const password = 'Password@123';
    const hash = await bcrypt.hash(password, 10);

    const emails = [
      'farmer@example.com',
      'expert@example.com',
      'scientist@example.com',
      'admin@example.com'
    ];

    for (const email of emails) {
      const [result] = await db.query(
        'UPDATE users SET password=? WHERE email=?',
        [hash, email]
      );

      console.log(`${email}: ${result.affectedRows} updated`);
    }

    console.log('\nPasswords reset successfully.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetPasswords();