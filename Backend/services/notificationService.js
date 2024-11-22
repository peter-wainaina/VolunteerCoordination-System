import { connectToDatabase } from '../db.js';

const createNotification = async ({
  type,
  message,
  link = null,
  recipientId = null,
  senderId = null,
  referenceId = null,
  referenceType = null
}) => {
  try {
    const db = await connectToDatabase(); 

    const query = `
      INSERT INTO notifications 
      (type, message, link, recipient_id, sender_id, reference_id, reference_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      type,
      message,
      link,
      recipientId,
      senderId,
      referenceId,
      referenceType
    ]);
    return result.insertId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const notificationTypes = {
  NEW_VOLUNTEER: 'NEW_VOLUNTEER',
  NEW_ORGANIZATION: 'NEW_ORGANIZATION',
  NEW_APPLICATION: 'NEW_APPLICATION',
  APPLICATION_STATUS: 'APPLICATION_STATUS',
  NEW_OPPORTUNITY: 'NEW_OPPORTUNITY',
  HOURS_LOGGED: 'HOURS_LOGGED'
};

export { createNotification };