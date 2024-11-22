import express from 'express';
import { connectToDatabase } from '../db.js';
import { createNotification, notificationTypes } from '../services/notificationService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Organizationrouter = express.Router();

Organizationrouter.post('/signup/organization', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const db = await connectToDatabase();

    // Check if the organization already exists
    const [rows] = await db.query('SELECT * FROM organizations WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Organization already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert the new organization
    await db.query(
      'INSERT INTO organizations (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashPassword]
    );
    // Create notification for new organization
    await createNotification({
      type: notificationTypes.NEW_ORGANIZATION,
      message: `New organization registered: ${username}`,
      link: `/admin/organizations/${result.insertId}`,
      referenceId: result.insertId,
      referenceType: 'organization'
    });

    return res.status(201).json({ message: "Organization created successfully" });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

Organizationrouter.post('/login/organization', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for organization email:', email);

    const db = await connectToDatabase();
    if (!db) {
      console.error('Database connection failed');
      return res.status(500).json({ message: "Database connection error" });
    }

    const [rows] = await db.query('SELECT * FROM organizations WHERE email = ?', [email]);
    console.log('Query result:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Organization does not exist" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Check for JWT_KEY
    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY is not set');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: rows[0].id, isOrganization: true },
      process.env.JWT_KEY,
      { expiresIn: '5h' }
    );

    return res.status(200).json({ 
      message: "Login successful",
      token: token,
      organization: {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

export default Organizationrouter;