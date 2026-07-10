import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pets, People, Assignment, LocalHospital, Home, Assessment, AccountCircle, Logout, AttachMoney } from '@mui/icons-material';
import NotificationSystem from './NotificationSystem';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Assessment />, adminOnly: false },
    { path: '/pets', label: 'Pets', icon: <Pets />, adminOnly: false },
    { path: '/adopters', label: 'Adopters', icon: <People />, adminOnly: false },
    { path: '/donations', label: 'Donations', icon: <AttachMoney />, adminOnly: false },
    { path: '/adoptions', label: 'Adoptions', icon: <Assignment />, adminOnly: true },
    { path: '/veterinary', label: 'Veterinary', icon: <LocalHospital />, adminOnly: true },
    { path: '/shelters', label: 'Shelters', icon: <Home />, adminOnly: true },
    { path: '/reports', label: 'Reports', icon: <Assessment />, adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pet Adoption and Care Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
          
          <NotificationSystem />
          
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={user?.role.toUpperCase()} 
              color={isAdmin ? 'error' : 'info'} 
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user?.username}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;