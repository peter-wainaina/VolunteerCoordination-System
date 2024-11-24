import express from 'express';
import cors from 'cors';
import authRouter from './Routes/authroutes.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import notificationRouter from './notifications.js';
import Organizationrouter from './Routes/organizationrouters.js';
import { connectToDatabase } from './db.js'; // Import the DB connection function

dotenv.config();


const app = express();
app.use(cors({
  origin: ["http://localhost:3001"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.use('/api', notificationRouter);
app.use('/auth', authRouter);
app.use('/auth', Organizationrouter);
app.use('/api/organization', Organizationrouter);

// Ensure DB connection before using it
let db;
connectToDatabase()
  .then((connection) => {
    db = connection; // Store the connection in `db` variable
    console.log('Database connection is ready.',{
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      PORT: process.env.PORT,
      JWT_KEY: process.env.JWT_KEY
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error.message);
  });
// Add this middleware function
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

// GET route to fetch opportunities by organization_id
app.get('/opportunities/organization', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM opportunities WHERE organization_id = ?';
    const [results] = await db.query(query, [req.user.id]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching organization opportunities:', err.message);
    res.status(500).json({ message: 'Failed to fetch opportunities', error: err.message });
  }
});

// POST route to create an opportunity
app.post('/opportunities', async (req, res) => {
  const { title, organization, location, type, date, skills, availability, description, status } = req.body;

  try {
    const db = await connectToDatabase();

    // Fetch the organization_id based on the organization name
    const orgQuery = 'SELECT id FROM organizations WHERE username = ?';
    const [orgResults] = await db.query(orgQuery, [organization]);

    if (orgResults.length === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const organization_id = orgResults[0].id;

      const query = `INSERT INTO opportunities (title, organization, organization_id, location, type, date, skills, availability, description, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await db.query(query, [title, organization, organization_id, location, type, date, skills, availability, description, status]);

      res.status(201).json({ id: results.insertId, title, organization, organization_id, location, type, date, skills, availability, description, status });
  } catch (err) {
      console.error('Error inserting opportunity:', err.message);
      res.status(500).json({ message: 'Failed to create opportunity', error: err.message });
  }
});

// PUT route to update an opportunity
app.put('/opportunities/:id', async (req, res) => {
  const opportunityId = req.params.id;
  const { title, organization, organization_id, location, type, date, skills, availability, description, status } = req.body;

  const query = `
    UPDATE opportunities
    SET title = ?, organization = ?, organization_id = ?, location = ?, type = ?, date = ?, skills = ?, availability = ?, description = ?, status = ?
    WHERE id = ?
  `;

  try {
      const [results] = await db.query(query, [title, organization, organization_id, location, type, date, skills, availability, description, status, opportunityId]);
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Opportunity not found' });
      }
      res.status(200).json({ id: opportunityId, title, organization, organization_id, location, type, date, skills, availability, description, status });
  } catch (err) {
      console.error('Error updating opportunity:', err.message);
      res.status(500).json({ message: 'Failed to update opportunity', error: err.message });
  }
});
// DELETE route to delete an opportunity
app.delete('/opportunities/:id', async (req, res) => {
    const opportunityId = req.params.id; // Get the opportunity ID from the URL

    const query = `DELETE FROM opportunities WHERE id = ?`;

    try {
        const [results] = await db.query(query, [opportunityId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        res.status(200).json({ message: 'Opportunity deleted successfully' });
    } catch (err) {
        console.error('Error deleting opportunity:', err.message);
        res.status(500).json({ message: 'Failed to delete opportunity', error: err.message });
    }
});

// Middleware to verify the JWT token


app.get('/suggestions', verifyToken, async (req, res) => {
  const volunteer_id = req.user.id; // Get the volunteer_id from the token

  try {
    // First, get the volunteer's skills
    const [volunteer] = await db.query('SELECT skills FROM users WHERE id = ?', [volunteer_id]);

    if (volunteer.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const volunteerSkills = volunteer[0].skills.split(',').map(skill => skill.trim());

    // Now, fetch all opportunities
    const [opportunities] = await db.query('SELECT * FROM opportunities');

    // Calculate matching skills for each opportunity
    const opportunitiesWithMatches = opportunities.map(opportunity => {
      const opportunitySkills = opportunity.skills.split(',').map(skill => skill.trim());
      const matchingSkills = opportunitySkills.filter(skill => volunteerSkills.includes(skill));
      return {
        ...opportunity,
        matching_skills: matchingSkills.length,
        matched_skills: matchingSkills
      };
    });

    // Sort opportunities by number of matching skills (descending)
    opportunitiesWithMatches.sort((a, b) => b.matching_skills - a.matching_skills);

    res.status(200).json(opportunitiesWithMatches);
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ message: 'Failed to fetch suggestions', error: err.message });
  }
});

// GET route to fetch all opportunities

//application routes

// POST route to submit an application
app.post('/api/applications', verifyToken, async (req, res) => {
  const volunteer_id = req.user.id;
  const {opportunityId,firstName, lastName,email,phone,dateOfBirth,address,emergencyContact,emergencyPhone,availability,experience,interests,additionalInfo} = req.body;

  try {
    // we use this to check if the user has already applied for the opportunity
    const [existingApplication] = await db.query(
      'SELECT * FROM applications WHERE opportunity_id = ? AND user_id = ?',
      [opportunityId, volunteer_id]
    );

    if (existingApplication.length > 0) {
      return res.status(400).json({
        message: 'You have already applied for this opportunity'
      });
    }
    // Insert application
    const query = `
      INSERT INTO applications (opportunity_id,user_id,first_name,last_name,email,phone,date_of_birth, address,emergency_contact,emergency_phone,availability,experience,interests,additional_info,status,application_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    const [result] = await db.query(query, [
      opportunityId,volunteer_id,firstName,lastName,email,phone,dateOfBirth,address,emergencyContact,emergencyPhone,JSON.stringify(availability),experience,interests,additionalInfo
    ]);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({
      message: 'Failed to submit application',
      error: err.message
    });
  }
});

app.get('/api/opportunities/get/:id', async (req, res) => {
  try {
    console.log('Fetching opportunity with ID:', req.params.id);
    
    const [rows] = await db.query(
      'SELECT * FROM opportunities WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Opportunity not found' 
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Error fetching opportunity:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity',
      error: err.message
    });
  }
});

app.get('/api/applications', verifyToken, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const query = `
      SELECT 
        a.*,
        o.title as opportunity_title,
        o.organization as organization_name
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.user_id = ?
      ORDER BY a.application_date DESC
    `;
    
    const [applications] = await db.query(query, [userId]);
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({
      message: 'Failed to fetch applications',
      error: err.message
    });
  }
});

// POST route to bookmark an opportunity
app.post('/api/bookmarks', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { opportunityId } = req.body;

  try {
    const query = `INSERT INTO bookmarks (user_id, opportunity_id) VALUES (?, ?)`;
    await db.query(query, [userId, opportunityId]);

    res.status(201).json({ message: 'Opportunity bookmarked successfully' });
  } catch (err) {
    console.error('Error bookmarking opportunity:', err);
    res.status(500).json({ message: 'Failed to bookmark opportunity', error: err.message });
  }
});

// GET route to fetch bookmarked opportunities
app.get('/api/bookmarks', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT o.* FROM bookmarks b
      JOIN opportunities o ON b.opportunity_id = o.id
      WHERE b.user_id = ?
    `;
    const [bookmarkedOpportunities] = await db.query(query, [userId]);

    res.status(201).json(bookmarkedOpportunities);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    res.status(500).json({ message: 'Failed to fetch bookmarks', error: err.message });
  }
});

// DELETE route to remove a bookmark
app.delete('/api/bookmarks/:opportunityId', verifyToken, async (req, res) => {
  const userId = req.user_id; // Corrected to req.user_id
  const opportunityId = req.params.opportunityId;

  try {
    console.log(`Attempting to delete bookmark for opportunity ID ${opportunityId} for user ${userId}`);
    const query = `DELETE FROM bookmarks WHERE opportunity_id = ? `;
    const [result] = await db.query(query, [opportunityId, userId]);

    if (result.affectedRows === 0) {
      console.log('Bookmark not found');
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    console.log('Bookmark removed successfully');
    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (err) {
    console.error('Error removing bookmark:', err);
    res.status(500).json({ message: 'Failed to remove bookmark', error: err.message });
  }
});

app.post('/api/volunteer-hours', verifyToken, async (req, res) => {
  const { title, date, hours, category, organization_name } = req.body;
  const userId = req.user.id;

  try {
    const query = `
      INSERT INTO volunteer_hours 
      (user_id, title, date, hours, category, organization_name, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await db.query(query, [
      userId, 
      title, 
      date, 
      hours, 
      category,
      organization_name
    ]);

    res.status(201).json({
      message: 'Hours logged successfully',
      data: {
        id: result.insertId,
        user_id: userId,
        title,
        date,
        hours,
        category,
        organization_name,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Error logging volunteer hours:', err);
    res.status(500).json({ message: 'Failed to log hours' });
  }
});


app.get('/api/volunteer-stats', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch volunteer data
    const [volunteerData] = await db.query('SELECT name, skills FROM users WHERE id = ?', [userId]);
    
    // Fetch total hours (corrected column name)
    const [totalHours] = await db.query('SELECT SUM(hours) as totalHours FROM volunteer_hours WHERE user_id = ?', [userId]);
    
    // Fetch recent hours (corrected column name)
    const [recentHours] = await db.query('SELECT SUM(hours) as recentHours FROM volunteer_hours WHERE user_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)', [userId]);
    
    // Fetch user's skills (assuming skills are stored in the users table)
    const userSkills = volunteerData[0].skills ? volunteerData[0].skills.split(',').map(skill => skill.trim()) : [];

    // Fetch organizations the user has applied to
    const [appliedOrgs] = await db.query(`
      SELECT DISTINCT o.organization 
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.user_id = ?
    `, [userId]);

    const appliedOrgsList = appliedOrgs.map(org => org.organization);

    // Fetch upcoming events based on user's skills or applied organizations
    const [upcomingEvents] = await db.query(`
      SELECT id, title, date, location, organization, skills, type, availability, description, status
      FROM opportunities
      WHERE date > CURDATE() 
        AND (
          ${userSkills.length ? userSkills.map(() => 'FIND_IN_SET(?, skills)').join(' OR ') : '1=0'}
          ${appliedOrgsList.length ? 'OR organization IN (' + appliedOrgsList.map(() => '?').join(', ') + ')' : ''}
        )
      ORDER BY date ASC 
      LIMIT 5
    `, [...userSkills, ...appliedOrgsList]);
    
    // Fetch recent activities (corrected column name)
    const [recentActivities] = await db.query('SELECT id, title, date, hours, category FROM volunteer_hours WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId]);
    
    // Fetch hours by category (corrected column name)
    const [hoursByCategory] = await db.query('SELECT category, SUM(hours) as hours FROM volunteer_hours WHERE user_id = ? GROUP BY category', [userId]);

    // Fetch achievements count (corrected column name)
    const [achievementsCount] = await db.query('SELECT COUNT(*) as count FROM achievements WHERE user_id = ?', [userId]);

    res.json({
      name: volunteerData[0].name,
      totalHours: totalHours[0].totalHours || 0,
      recentHours: recentHours[0].recentHours || 0,
      achievements: achievementsCount[0].count,
      upcomingEvents,
      recentActivities,
      hoursByCategory
    });
  } catch (err) {
    console.error('Error fetching volunteer stats:', err);
    res.status(500).json({ message: 'Failed to fetch volunteer stats', error: err.message });
  }
});

app.delete('/api/volunteer-hours/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Verify the entry belongs to the user
    const [entry] = await db.query(
      'SELECT user_id FROM volunteer_hours WHERE id = ?',
      [id]
    );

    if (!entry.length || entry[0].user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.query('DELETE FROM volunteer_hours WHERE id = ?', [id]);
    res.json({ message: 'Hours entry deleted successfully' });

  } catch (err) {
    console.error('Error deleting volunteer hours:', err);
    res.status(500).json({ message: 'Failed to delete hours', error: err.message });
  }
});
// PUT endpoint to update a volunteer hours entry
app.put('/api/volunteer-hours/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, date, hours, category } = req.body;

  try {
    // Verify the entry belongs to the user
    const [entry] = await db.query(
      'SELECT user_id FROM volunteer_hours WHERE id = ?',
      [id]
    );

    if (!entry.length || entry[0].user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Input validation
    if (!title || !date || !hours || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate hours
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum < 0.5 || hoursNum > 24) {
      return res.status(400).json({ message: 'Hours must be between 0.5 and 24' });
    }

    const query = `
      UPDATE volunteer_hours 
      SET title = ?, date = ?, hours = ?, category = ?
      WHERE id = ? AND user_id = ?
    `;

    await db.query(query, [title, date, hoursNum, category, id, userId]);
    res.json({ message: 'Hours entry updated successfully' });

  } catch (err) {
    console.error('Error updating volunteer hours:', err);
    res.status(500).json({ message: 'Failed to update hours', error: err.message });
  }
});

// Get volunteer hours for organization's opportunities
app.get('/api/organization/volunteer-hours', verifyToken, async (req, res) => {
  try {
    // Get organization name from the organizations table
    const [org] = await db.query(
      'SELECT username FROM organizations WHERE id = ?',
      [req.user.id]
    );

    if (!org.length) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const organizationName = org[0].username;

    // Fetch volunteer hours for this organization
    const query = `
      SELECT 
        vh.*,
        u.name as volunteer_name,
        title as opportunity_title,
        (SELECT GROUP_CONCAT(title) 
         FROM achievements 
         WHERE user_id = vh.user_id) as achievements
      FROM volunteer_hours vh
      JOIN users u ON vh.user_id = u.id
      WHERE vh.organization_name = ?
      ORDER BY vh.date DESC
    `;

    const [hours] = await db.query(query, [organizationName]);
    res.json(hours);
  } catch (err) {
    console.error('Error fetching volunteer hours:', err);
    res.status(500).json({ message: 'Failed to fetch volunteer hours' });
  }
});

// Award achievement to volunteer
app.post('/api/volunteer/achievements', verifyToken, async (req, res) => {
  try {
    const { user_id, title, description } = req.body;
    
    // Verify the organization has authority to award
    const [org] = await db.query(
      'SELECT username FROM organizations WHERE id = ?',
      [req.user.id]
    );

    if (!org.length) {
      return res.status(403).json({ message: 'Unauthorized to award achievements' });
    }

    // Check if volunteer exists
    const [volunteer] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );

    if (!volunteer.length) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Insert achievement
    const [result] = await db.query(
      `INSERT INTO achievements (user_id, title, description, date_achieved) 
       VALUES (?, ?, ?, CURDATE())`,
      [user_id, title, description]
    );

    res.status(201).json({
      message: 'Achievement awarded successfully',
      achievement: {
        id: result.insertId,
        user_id,
        title,
        description,
        date_achieved: new Date()
      }
    });

  } catch (err) {
    console.error('Error awarding achievement:', err);
    res.status(500).json({ 
      message: 'Failed to award achievement',
      error: err.message 
    });
  }
});

app.put('/api/organization/verify-hours/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status, verification_note } = req.body;
  
  try {
    // Get organization name
    const [org] = await db.query(
      'SELECT username FROM organizations WHERE id = ?',
      [req.user.id]
    );

    if (!org.length) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Update the status
    const [result] = await db.query(
      'UPDATE volunteer_hours SET status = ?, verification_note = ? WHERE id = ?',
      [status, verification_note || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Volunteer hours record not found' });
    }

    res.json({ message: 'Hours verification updated successfully' });
  } catch (err) {
    console.error('Error verifying hours:', err);
    res.status(500).json({ message: 'Failed to verify hours', error: err.message });
  }
});




// Add this endpoint to fetch applicants for a specific organization
app.get('/api/organizations/applicants', verifyToken, async (req, res) => {
  const organizationId = req.user.id; // Assuming the organization's ID is stored in the token

  try {
    const query = `
      SELECT a.*, o.title as applied_for
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE o.organization_id = ?
      ORDER BY a.application_date DESC
    `;
    const [applicants] = await db.query(query, [organizationId]);

    res.json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: 'Failed to fetch applicants', error: err.message });
  }
});
// Update applicant status
app.put('/api/applicant/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  
  try {
    const query = `
      UPDATE applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      SET a.status = ?
      WHERE a.id = ? AND o.organization_id = ?
    `;
    const [result] = await db.query(query, [status, req.params.id, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Applicant not found or not authorized' });
    }

    res.json({ message: 'Applicant status updated successfully' });
  } catch (err) {
    console.error('Error updating applicant status:', err);
    res.status(500).json({ message: 'Failed to update applicant status', error: err.message });
  }
});

app.get('/api/applicant/:id', verifyToken, async (req, res) => {
  console.log('Fetching applicant with ID:', req.params.id);
  console.log('User ID from token:', req.user.id);

  try {
    const query = `
      SELECT a.*, o.title as applied_for
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.id = ? AND o.organization_id = ?
    `;
    const [applicant] = await db.query(query, [req.params.id, req.user.id]);

    console.log('Query result:', applicant);

    if (applicant.length === 0) {
      console.log('No applicant found');
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.json(applicant[0]);
  } catch (err) {
    console.error('Error fetching applicant details:', err);
    res.status(500).json({ message: 'Failed to fetch applicant details', error: err.message });
  }
});
//recent organization opportunities
app.get('/api/Organization/view-opportunities', verifyToken, async (req, res) => {
  const organizationId = req.user.id; // Assuming the organization's ID is stored in the token

  try {
    const query = `
      SELECT o.*, 
             COUNT(a.id) as applicant_count
      FROM opportunities o
      LEFT JOIN applications a ON o.id = a.opportunity_id
      WHERE o.organization_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    const [opportunities] = await db.query(query, [organizationId]);

    res.json(opportunities);
  } catch (err) {
    console.error('Error fetching organization opportunities:', err);
    res.status(500).json({ message: 'Failed to fetch opportunities', error: err.message });
  }
});


app.get('/api/opportunities/:id/applicants', verifyToken, async (req, res) => {
  const opportunityId = req.params.id;
  const organizationId = req.user.id; 

  try {
    const query = `
      SELECT a.id, a.first_name, a.last_name, a.email, a.status, a.application_date
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.opportunity_id = ? AND o.organization_id = ?
      ORDER BY a.application_date DESC
    `;
    const [applicants] = await db.query(query, [opportunityId, organizationId]);

    // Format the applicant data
    const formattedApplicants = applicants.map(applicant => ({
      id: applicant.id,
      name: `${applicant.first_name} ${applicant.last_name}`,
      email: applicant.email,
      status: applicant.status,
      applicationDate: applicant.application_date
    }));

    res.json(formattedApplicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: 'Failed to fetch applicants', error: err.message });
  }
});
//orgdash info
app.get('/api/organizations/recent-opportunities', verifyToken, async (req, res) => {
  const organizationId = req.user.id;
  try {
    const query = `
      SELECT o.id, o.title, COUNT(a.id) as applicants, o.created_at as datePosted
      FROM opportunities o
      LEFT JOIN applications a ON o.id = a.opportunity_id
      WHERE o.organization_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 8
    `;
    const [recentOpportunities] = await db.query(query, [organizationId]);
    res.json(recentOpportunities);
  } catch (err) {
    console.error('Error fetching recent opportunities:', err);
    res.status(500).json({ message: 'Failed to fetch recent opportunities', error: err.message });
  }
});
app.get('/api/organizations/recent-applicants', verifyToken, async (req, res) => {
  const organizationId = req.user.id;
  try {
    const query = `
      SELECT a.id, CONCAT(a.first_name, ' ', a.last_name) as name, o.title as applied_for, a.application_date as date
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE o.organization_id = ?
      ORDER BY a.application_date DESC
      LIMIT 8
    `;
    const [recentApplicants] = await db.query(query, [organizationId]);
    res.json(recentApplicants);
  } catch (err) {
    console.error('Error fetching recent applicants:', err);
    res.status(500).json({ message: 'Failed to fetch recent applicants', error: err.message });
  }
});
// Admin side  collecting relevant information

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Count volunteers (users with role 'volunteer')
    const [volunteerCount] = await db.query('SELECT COUNT(*) as count FROM users ');
    console.log('Volunteer count:', volunteerCount);
    
    // Count organizations (users with role 'organization')
    const [organizationCount] = await db.query('SELECT COUNT(*) as count FROM organizations');
    console.log('Organization count:', organizationCount);
    
    const [ongoingOpportunities] = await db.query('SELECT COUNT(*) as count FROM opportunities WHERE status = "ongoing"');
    console.log('Ongoing opportunities:', ongoingOpportunities);

    const [completedOpportunities] = await db.query('SELECT COUNT(*) as count FROM opportunities WHERE status = "completed"');
    console.log('Completed opportunities:', completedOpportunities);

    const [volunteerHours] = await db.query('SELECT SUM(hours) as total FROM volunteer_hours');
    console.log('Volunteer hours:', volunteerHours);

    const response = {
      totalVolunteers: volunteerCount[0].count,
      totalOrganizations: organizationCount[0].count,
      ongoingOpportunities: ongoingOpportunities[0].count,
      completedOpportunities: completedOpportunities[0].count,
      volunteerHours: volunteerHours[0].total || 0
    };

    // console.log('Response:', response);
    res.json(response);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// const verifyAdminToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Invalid token format' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.error('Token verification error:', err);
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
//     }

//     req.user = decoded;
//     next();
//   });
// };

app.get('/api/users',  async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, phonenumber, skills, availability FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Modify the PUT users route
app.put('/api/users/:id',  async (req, res) => {
  const { id } = req.params;
  const { name, email, phonenumber, availability, skills } = req.body;
  try {
    await db.query('UPDATE users SET name = ?, email = ?, phonenumber = ?, availability = ?, skills = ? WHERE id = ?', 
      [name, email, phonenumber, availability, skills, id]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});
app.delete('/api/users/:id',  async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

//organization side
app.get('/api/organizations', async (req, res) => {
  try {
    const [organizations] = await db.query('SELECT id, username, email, created_at FROM organizations');
    res.json(organizations);
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).json({ message: 'Failed to fetch organizations', error: err.message });
  }
});

// Update an organization
app.put('/api/organizations/:id',  async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    await db.query('UPDATE organizations SET username = ?, email = ? WHERE id = ?', 
      [username, email, id]);
    res.json({ message: 'Organization updated successfully' });
  } catch (err) {
    console.error('Error updating organization:', err);
    res.status(500).json({ message: 'Failed to update organization', error: err.message });
  }
});

// Delete an organization
app.delete('/api/organizations/:id',  async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM organizations WHERE id = ?', [id]);
    res.json({ message: 'Organization deleted successfully' });
  } catch (err) {
    console.error('Error deleting organization:', err);
    res.status(500).json({ message: 'Failed to delete organization', error: err.message });
  }
});
//adding new users


app.post('/api/users', async (req, res) => {
  const { type, username, email, password, name, phonenumber, skills, availability } = req.body;

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let query, params;

    if (type === 'volunteer') {
      query = 'INSERT INTO users (name, email, password, phonenumber, skills, availability) VALUES (?, ?, ?, ?, ?, ?)';
      params = [username, email, hashedPassword, phonenumber, skills, availability];
    } else if (type === 'organization') {
      query = 'INSERT INTO organizations (username, email, password) VALUES (?, ?, ?)';
      params = [username, email, hashedPassword];
    } else if (type === 'admin') {
      query = 'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)';
      params = [username, email, hashedPassword];
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const [result] = await db.query(query, params);
    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
});

//feedback side
app.post('/api/volunteer-feedback', async (req, res) => {
  const { name, email, opportunity, satisfaction, feedback } = req.body;

  try {
    const db = await connectToDatabase();
    const query = `
      INSERT INTO volunteer_feedback (name, email, opportunity, satisfaction, feedback)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [name, email, opportunity, satisfaction, feedback]);
    res.status(201).json({ message: 'Volunteer feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting volunteer feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
});
app.post('/api/organization-feedback', async (req, res) => {
  const { name, email, project, satisfaction, feedback } = req.body;

  try {
    const db = await connectToDatabase();
    const query = `
      INSERT INTO organization_feedback (organization_name, email, project_name, satisfaction, feedback)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [name, email, project, satisfaction, feedback]);
    res.status(201).json({ message: 'Organization feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting organization feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
});

// GET route for volunteer feedback
// GET route for volunteer feedback
app.get('/api/volunteer-feedback', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, opportunity, satisfaction, feedback, created_at
      FROM volunteer_feedback
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching volunteer feedback:', error);
    res.status(500).json({ message: 'Error fetching volunteer feedback', error: error.message });
  }
});
app.get('/api/organization-feedback', async (req, res) => {
  try {
    const query = `
      SELECT id, organization_name, email, project_name, satisfaction, feedback, created_at
      FROM organization_feedback
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching organization feedback:', error);
    res.status(500).json({ message: 'Error fetching organization feedback', error: error.message });
  }
});
const getTimeParams = (period) => {
  switch (period) {
    case 'daily':
      return {
        timeFormat: '%Y-%m-%d',
        interval: '30 DAY',
        groupBy: 'DATE(created_at)'
      };
    case 'weekly':
      return {
        timeFormat: '%Y-Week %u',
        interval: '12 WEEK',
        groupBy: 'YEARWEEK(created_at)'
      };
    case 'monthly':
      return {
        timeFormat: '%Y-%m',
        interval: '12 MONTH',
        groupBy: 'DATE_FORMAT(created_at, "%Y-%m")'
      };
    case 'yearly':
      return {
        timeFormat: '%Y',
        interval: '5 YEAR',
        groupBy: 'YEAR(created_at)'
      };
    default:
      return {
        timeFormat: '%Y-%m-%d',
        interval: '30 DAY',
        groupBy: 'DATE(created_at)'
      };
  }
};

// GET route for organization feedback
// 1. Volunteer Engagement Data
app.get('/api/stats/volunteer-engagement', async (req, res) => {
  const { period = 'weekly' } = req.query;
  try {
    const { timeFormat, interval, groupBy } = getTimeParams(period);
    
    const query = `
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as value
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY ${groupBy}
      ORDER BY created_at DESC
    `;
    
    const [results] = await db.query(query, [timeFormat]);
    res.json(results.map(row => ({
      name: row.period,
      value: parseInt(row.value)
    })));
  } catch (error) {
    console.error('Error fetching volunteer engagement:', error);
    res.status(500).json({ message: 'Error fetching volunteer engagement data' });
  }
});

// 2. Volunteer Metrics (Multi-series data)
// 2. Volunteer Metrics (Multi-series data)
app.get('/api/stats/volunteer-metrics', async (req, res) => {
  const { period = 'weekly' } = req.query;
  try {
    let timeFormat, interval, groupBy;
    
    switch (period) {
      case 'daily':
        timeFormat = '%Y-%m-%d';
        interval = '30 DAY';
        groupBy = 'DATE(vh.date)';
        break;
      case 'weekly':
        timeFormat = '%Y-Week %u';
        interval = '12 WEEK';
        groupBy = 'YEARWEEK(vh.date)';
        break;
      case 'monthly':
        timeFormat = '%Y-%m';
        interval = '12 MONTH';
        groupBy = 'DATE_FORMAT(vh.date, "%Y-%m")';
        break;
      case 'yearly':
        timeFormat = '%Y';
        interval = '5 YEAR';
        groupBy = 'YEAR(vh.date)';
        break;
      default:
        timeFormat = '%Y-%m-%d';
        interval = '30 DAY';
        groupBy = 'DATE(vh.date)';
    }
    
    const query = `
      SELECT 
        DATE_FORMAT(vh.date, ?) as period,
        COUNT(DISTINCT vh.user_id) as volunteers,
        SUM(vh.hours) as hours,
        COUNT(DISTINCT vh.title) as projects
      FROM volunteer_hours vh
      WHERE vh.date >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY ${groupBy}
      ORDER BY vh.date DESC
    `;
    
    const [results] = await db.query(query, [timeFormat]);
    res.json(results.map(row => ({
      name: row.period,
      volunteers: parseInt(row.volunteers),
      hours: parseFloat(row.hours) || 0,
      projects: parseInt(row.projects)
    })));
  } catch (error) {
    console.error('Error fetching volunteer metrics:', error);
    res.status(500).json({ message: 'Error fetching volunteer metrics' });
  }
});
// 3. User Signups Data
app.get('/api/stats/user-signups', async (req, res) => {
  const { period = 'monthly' } = req.query;
  try {
    const { timeFormat, interval, groupBy } = getTimeParams(period);
    
    const query = `
      SELECT 
        DATE_FORMAT(u.created_at, ?) as period,
        COUNT(u.id) as volunteers,
        (
          SELECT COUNT(*)
          FROM organizations o
          WHERE ${groupBy.replace('created_at', 'o.created_at')} = ${groupBy.replace('created_at', 'u.created_at')}
        ) as organizations
      FROM users u
      WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY ${groupBy}
      ORDER BY u.created_at DESC
    `;
    
    const [results] = await db.query(query, [timeFormat]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching user signups:', error);
    res.status(500).json({ message: 'Error fetching user signups' });
  }
});
// 4. Application Trends
app.get('/api/stats/application-trends', async (req, res) => {
  const { period = 'monthly' } = req.query;
  try {
    const { timeFormat, interval } = getTimeParams(period);
    
    const query = `
      SELECT 
        DATE_FORMAT(application_date, ?) as period,
        COUNT(*) as applications,
        COUNT(CASE WHEN status = 'Accepted' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending
      FROM applications
      WHERE application_date >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY DATE_FORMAT(application_date, ?)
      ORDER BY application_date DESC
    `;
    
    const [results] = await db.query(query, [timeFormat, timeFormat]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching application trends:', error);
    res.status(500).json({ message: 'Error fetching application trends', error: error.message });
  }
});
// 5. Opportunity Types Distribution
app.get('/api/stats/opportunity-types', async (req, res) => {
  const { period = 'monthly' } = req.query;
  try {
    const { timeFormat, interval, groupBy } = getTimeParams(period);
    
    const query = `
      SELECT 
        o.availability as type,
        COUNT(o.id) as opportunities,
        COUNT(a.id) as applications,
        DATE_FORMAT(o.created_at, ?) as period
      FROM opportunities o
      LEFT JOIN applications a ON o.id = a.opportunity_id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY o.availability, ${groupBy}
      ORDER BY o.created_at DESC
    `;
    
    const [results] = await db.query(query, [timeFormat]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching opportunity types:', error);
    res.status(500).json({ message: 'Error fetching opportunity types' });
  }
});
// 6. Dashboard Overview Stats
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Current counts
    const [[volunteerCount], [organizationCount], [volunteerHours], [ongoingOpportunities], [completedOpportunities]] = 
    await Promise.all([
      db.query('SELECT COUNT(*) as count FROM users'),
      db.query('SELECT COUNT(*) as count FROM organizations'),
      db.query('SELECT COALESCE(SUM(hours), 0) as total FROM volunteer_hours'),
      db.query('SELECT COUNT(*) as count FROM opportunities WHERE status = "ongoing"'),
      db.query('SELECT COUNT(*) as count FROM opportunities WHERE status = "completed"')
    ]);

    // Monthly changes
    const [[monthlyChanges]] = await db.query(`
      SELECT 
        (
          SELECT COUNT(*) 
          FROM users 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ) as newVolunteers,
        (
          SELECT COUNT(*) 
          FROM organizations 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ) as newOrganizations,
        (
          SELECT COALESCE(SUM(hours), 0)
          FROM volunteer_hours 
          WHERE date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ) as monthlyHours,
        (
          SELECT COUNT(*)
          FROM opportunities
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          AND status = "ongoing"
        ) as newOpportunities
    `);

    res.json({
      totalVolunteers: volunteerCount.count,
      totalOrganizations: organizationCount.count,
      volunteerHours: volunteerHours.total,
      ongoingOpportunities: ongoingOpportunities.count,
      completedOpportunities: completedOpportunities.count,
      changes: {
        totalVolunteers: monthlyChanges.newVolunteers,
        totalOrganizations: monthlyChanges.newOrganizations,
        volunteerHours: monthlyChanges.monthlyHours,
        opportunities: monthlyChanges.newOpportunities
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});




app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNING on port ${process.env.PORT}`);
});
