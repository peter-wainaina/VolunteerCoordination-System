// routes/auth.js
import express from 'express';
import { connectToDatabase } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createNotification, notificationTypes } from '../services/notificationService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Test route to confirm the signup route is working
router.get('/signup/test', (req, res) => {
  res.send("Signup test route is working!");
});

// Signup route for users
router.post('/signup', async (req, res) => {
  const { name, email, password, phonenumber, skills, availability } = req.body;

  try {
    const db = await connectToDatabase();

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phonenumber, skills, availability) VALUES (?, ?, ?, ?, ?, ?)', 
      [name, email, hashPassword, phonenumber, skills, availability]
    );

    // Creates a notification for the new volunteer
    await createNotification({
      type: notificationTypes.NEW_VOLUNTEER,
      message: `New volunteer registered: ${name}`,
      link: `/admin/volunteers/${result.insertId}`,
      referenceId: result.insertId,
      referenceType: 'volunteer'
    });
    console.log(`Notification created for new volunteer: ${name}`);

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/profile', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.id;

    const db = await connectToDatabase();
    const [rows] = await db.query(
      'SELECT id, name, email, phonenumber, skills, availability FROM users WHERE id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};
// Update user profile route
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phonenumber, skills, availability, password } = req.body;
    const db = await connectToDatabase();

    // Prepare update query and values
    let updateQuery = `
      UPDATE users 
      SET name = ?, email = ?, phonenumber = ?, skills = ?, availability = ?
    `;
    let updateValues = [name, email, phonenumber, skills, availability];

    // If password is provided, hash it and add to update
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = ?`;
      updateValues.push(hashPassword);
    }

    // Add WHERE clause
    updateQuery += ` WHERE id = ?`;
    updateValues.push(userId);

    // Update user profile
    await db.query(updateQuery, updateValues);

    // Get updated suggestions with matching calculation
    const [opportunities] = await db.query('SELECT * FROM opportunities WHERE status = "ongoing"');
    const updatedSkills = skills.split(',').map(skill => skill.trim());

    const opportunitiesWithMatches = opportunities.map(opportunity => {
      const opportunitySkills = opportunity.skills.split(',').map(skill => skill.trim());
      const matchingSkills = opportunitySkills.filter(skill => updatedSkills.includes(skill));
      return {
        ...opportunity,
        matching_skills: matchingSkills.length,
        matched_skills: matchingSkills,
        match_percentage: (matchingSkills.length / opportunitySkills.length) * 100
      };
    });

    const sortedOpportunities = opportunitiesWithMatches
      .sort((a, b) => b.matching_skills - a.matching_skills)
      .filter(opp => opp.matching_skills > 0);

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedSuggestions: sortedOpportunities
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//login for the volunteers
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);

    const db = await connectToDatabase();
    if (!db) {
      console.error('Database connection failed');
      return res.status(500).json({ message: "Database connection error" });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Query result:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Check for JWT_SECRET
    if (!process.env.JWT_KEY) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '5h'})

    return res.status(201).json({ 
      message: "Login successful",
      token: token,
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email
      }
    });
  } catch (err) {
    console.error('Login error:', err); 
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

//admin router
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Admin login attempt for email:', email);

    const db = await connectToDatabase();
    if (!db) {
      console.error('Database connection failed');
      return res.status(500).json({ message: "Database connection error" });
    }

    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    console.log('Query result:', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check for JWT_SECRET
    if (!process.env.JWT_KEY) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({id: rows[0].id, role: 'admin'}, process.env.JWT_KEY, {expiresIn: '5h'})

    return res.status(200).json({ 
      message: "Admin login successful",
      token: token,
      admin: {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email
      }
    });
  } catch (err) {
    console.error('Admin login error:', err); 
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

 


export default router;
