import React, { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Alert, InputAdornment, IconButton, Tabs, Tab, Divider, Fade
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, Pets, Security } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BiometricAuth from './BiometricAuth';
import TwoFactorAuth from './TwoFactorAuth';
import SecurityDashboard from './SecurityDashboard';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(0); // 0 for admin, 1 for user
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      } else {
        // Show 2FA for admin users
        if (loginType === 0) {
          setShowTwoFA(true);
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setLoginType(newValue);
    setUsername('');
    setPassword('');
    setError('');
  };

  const fillCredentials = () => {
    if (loginType === 0) {
      setUsername('admin');
      setPassword('admin');
    } else {
      setUsername('user');
      setPassword('user');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper elevation={10} sx={{ 
        p: 4, 
        width: '100%', 
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box textAlign="center" mb={3}>
          <Pets sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Pet Adoption and Care Management System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to manage pet adoptions
          </Typography>
        </Box>

        <Tabs 
          value={loginType} 
          onChange={handleTabChange} 
          centered 
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab 
            label="Admin Login" 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected': { 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }} 
          />
          <Tab 
            label="User Login" 
            sx={{ 
              fontWeight: 600,
              '&.Mui-selected': { 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }} 
          />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoComplete="username"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{
              py: 1.5,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
              },
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Signing In...' : `Sign In as ${loginType === 0 ? 'Admin' : 'User'}`}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={fillCredentials}
            sx={{
              py: 1,
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a6fd8',
                backgroundColor: 'rgba(102, 126, 234, 0.04)'
              }
            }}
          >
            Use Demo Credentials
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Button
            onClick={() => navigate('/reset-password')}
            sx={{
              color: '#667eea',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.04)'
              }
            }}
          >
            Forgot Password?
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">OR</Typography>
        </Divider>

        <BiometricAuth onSuccess={() => navigate('/', { replace: true })} />

        <Box mt={2} textAlign="center">
          <Button
            startIcon={<Security />}
            onClick={() => setShowSecurity(!showSecurity)}
            sx={{ color: '#667eea', textTransform: 'none' }}
          >
            Security Features
          </Button>
        </Box>

        {showTwoFA && (
          <Fade in={showTwoFA}>
            <Box>
              <TwoFactorAuth onSuccess={() => navigate('/', { replace: true })} />
            </Box>
          </Fade>
        )}

        {showSecurity && (
          <Fade in={showSecurity}>
            <Box>
              <SecurityDashboard />
            </Box>
          </Fade>
        )}

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {loginType === 0 ? 'Admin' : 'User'} Demo Credentials:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
            Username: {loginType === 0 ? 'admin' : 'user'} | Password: {loginType === 0 ? 'admin' : 'user'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;