import express from 'express';
import { connectToDatabase } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.user_id = decoded.id;
    next();
  });
};

// GET route to fetch suggested opportunities based on volunteer skills
router.get('/suggestions', verifyToken, async (req, res) => {
    const volunteer_id = req.user_id; // Get the volunteer_id from the token
  
    try {
      const db = await connectToDatabase();
      console.log('Connected to database');
  
      const [volunteer] = await db.query('SELECT skills FROM users WHERE id = ?', [volunteer_id]);
      console.log('Volunteer skills:', volunteer);
  
      if (volunteer.length === 0) {
        return res.status(404).json({ message: 'Volunteer not found' });
      }
  
      const volunteerSkills = volunteer[0].skills.split(',');
      console.log('Volunteer skills array:', volunteerSkills);
  
      const query = `
        SELECT o.*, 
        (SELECT COUNT(*) FROM (
          SELECT skill FROM (
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(o.skills, ',', numbers.n), ',', -1) skill
            FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) numbers
            WHERE CHAR_LENGTH(o.skills) - CHAR_LENGTH(REPLACE(o.skills, ',', '')) >= numbers.n - 1
          ) skills
          WHERE skill IN (?)
        ) matching_skills) AS matching_skills
        FROM opportunities o
        ORDER BY matching_skills DESC
      `;
      const [results] = await db.query(query, [volunteerSkills]);
      console.log('Matching opportunities:', results);
  
      res.status(200).json(results);
    } catch (err) {
      console.error('Error fetching suggestions:', err.message);
      res.status(500).json({ message: 'Failed to fetch suggestions', error: err.message });
    }
  });

export default router;