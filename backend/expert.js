const bcrypt = require('bcryptjs');
const db = require('./config/db');

const users = [
  {
    name: 'Dr. Kumar',
    email: 'expert@example.com',
    password: 'Password@123',
    role: 'expert'
  },
  {
    name: 'Dr. Priya',
    email: 'scientist@example.com',
    password: 'Password@123',
    role: 'scientist'
  },
  {
    name: 'Administrator',
    email: 'admin@example.com',
    password: 'Password@123',
    role: 'admin'
  }
];

async function createUsers() {
  try {
    for (const user of users) {

      const [existing] = await db.query(
        'SELECT id FROM users WHERE email=?',
        [user.email]
      );

      if (existing.length) {
        console.log(
          `${user.role} account already exists: ${user.email}`
        );
        continue;
      }

      const hash = await bcrypt.hash(user.password, 10);

      const [result] = await db.query(
        `INSERT INTO users
        (name, email, password, role, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.name,
          user.email,
          hash,
          user.role,
          null,
          null
        ]
      );

      console.log(
        `${user.role} account created successfully. ID: ${result.insertId}`
      );
    }

    console.log('\nAll accounts checked successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error creating accounts:', error);
    process.exit(1);
  }
}

createUsers();