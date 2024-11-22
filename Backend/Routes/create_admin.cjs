const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const saltRounds = 10;
const plainPassword = '12345';

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST?.replace(/'/g, '') || 'localhost',
      user: process.env.DB_USER?.replace(/'/g, '') || 'root',
      password: process.env.DB_PASSWORD?.replace(/'/g, '') || '',
      database: process.env.DB_NAME?.replace(/'/g, '') || 'authentication',
    });

    console.log('Connected to database successfully');

    // Insert the new admin
    const [result] = await connection.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      ['joseph', 'joseph@gmail.com', hashedPassword]
    );

    console.log('Admin created successfully:', result);

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();