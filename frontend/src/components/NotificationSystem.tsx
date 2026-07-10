import React, { useState, useEffect } from 'react';
import {
  Badge, IconButton, Popover, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Typography, Box, Divider, Button,
  Chip, Paper
} from '@mui/material';
import {
  Notifications, Circle, Schedule, Pets, LocalHospital,
  Assignment, Warning, CheckCircle
} from '@mui/icons-material';

interface Notification {
  id: number;
  type: 'reminder' | 'application' | 'medical' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationSystem: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: 'reminder',
        title: 'Vaccination Due',
        message: 'Buddy needs his annual rabies vaccination',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'application',
        title: 'New Adoption Application',
        message: 'Sarah Johnson applied to adopt Luna',
        timestamp: '4 hours ago',
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'medical',
        title: 'Medical Checkup Complete',
        message: 'Max completed his health examination',
        timestamp: '1 day ago',
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'urgent',
        title: 'Shelter Capacity Alert',
        message: 'Happy Paws Shelter is at 95% capacity',
        timestamp: '2 days ago',
        read: false,
        priority: 'high'
      }
    ]);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Schedule color="warning" />;
      case 'application': return <Assignment color="primary" />;
      case 'medical': return <LocalHospital color="success" />;
      case 'urgent': return <Warning color="error" />;
      default: return <Notifications />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#27AE60';
      default: return '#95A5A6';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ mr: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 400, maxHeight: 500 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </Box>
            {unreadCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                You have {unreadCount} unread notifications
              </Typography>
            )}
          </Box>

          <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="body2"
                          fontWeight={notification.read ? 400 : 600}
                        >
                          {notification.title}
                        </Typography>
                        <Circle
                          sx={{
                            fontSize: 8,
                            color: getPriorityColor(notification.priority),
                          }}
                        />
                        {!notification.read && (
                          <Circle
                            sx={{
                              fontSize: 8,
                              color: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Typography variant="caption" color="text.secondary">
                            {notification.timestamp}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              backgroundColor: getPriorityColor(notification.priority),
                              color: 'white',
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          {notifications.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications at the moment
              </Typography>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default NotificationSystem;