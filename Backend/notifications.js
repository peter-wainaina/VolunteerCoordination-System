import express from 'express';
import { connectToDatabase } from './db.js';

const router = express.Router();

// Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const query = `
      SELECT * FROM notifications 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    const [notifications] = await db.query(query);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE');
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

export default router;