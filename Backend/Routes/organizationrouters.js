import express from 'express';
import { connectToDatabase } from '../db.js';
import { createNotification, notificationTypes } from '../services/notificationService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Organizationrouter = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};


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

Organizationrouter.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('Fetching profile for organization ID:', req.user.id);
    const db = await connectToDatabase();
    const [rows] = await db.query(
      'SELECT id, username, email, password, created_at FROM organizations WHERE id = ?', // Added password to SELECT
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    // Send all data except password
    const { password, ...orgData } = rows[0];
    console.log('Found organization:', orgData);
    return res.status(200).json({ ...orgData, currentPassword: password }); // Include hashed password as currentPassword
  } catch (err) {
    console.error('Error fetching organization profile:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


Organizationrouter.put('/update-profile', verifyToken, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const id = req.user.id;

  try {
    const db = await connectToDatabase();
    
    // First, verify the organization exists
    const [org] = await db.query('SELECT * FROM organizations WHERE id = ?', [id]);
    
    if (org.length === 0) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // If updating password, verify current password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, org[0].password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
    }

    // Prepare update query
    let updateQuery = 'UPDATE organizations SET ';
    const updateValues = [];
    
    if (username) {
      updateQuery += 'username = ?, ';
      updateValues.push(username);
    }
    
    if (email) {
      updateQuery += 'email = ?, ';
      updateValues.push(email);
    }
    
    if (newPassword) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      updateQuery += 'password = ?, ';
      updateValues.push(hashPassword);
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ?';
    updateValues.push(id);

    await db.query(updateQuery, updateValues);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default Organizationrouter;