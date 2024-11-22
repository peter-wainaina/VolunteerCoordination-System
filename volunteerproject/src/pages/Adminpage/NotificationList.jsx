import React from 'react';
import { List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useAdminDashboard from './useAdminDashboard';

const NotificationList = () => {
  const { notifications, markNotificationAsRead } = useAdminDashboard();

  return (
    <List>
      {notifications.map((notification) => (
        <ListItem
          key={notification.id}
          secondaryAction={
            <IconButton edge="end" aria-label="mark as read" onClick={() => markNotificationAsRead(notification.id)}>
              <CheckCircleIcon color={notification.read ? 'disabled' : 'primary'} />
            </IconButton>
          }
        >
          <ListItemText
            primary={notification.message}
            secondary={
              <Typography
                component="span"
                variant="body2"
                color={notification.read ? 'textSecondary' : 'primary'}
              >
                {notification.read ? 'Read' : 'Unread'}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;