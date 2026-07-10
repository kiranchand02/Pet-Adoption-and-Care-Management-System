import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Alert, Stepper, Step, StepLabel, InputAdornment, IconButton
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PasswordReset: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { requestPasswordReset, verifyResetToken, resetPassword } = useAuth();

  const steps = ['Enter Email', 'Enter Reset Code', 'Set New Password'];

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setToken(result.token || '');
        setMessage(result.message);
        setActiveStep(1);
        // Store the token for verification but don't show it
        localStorage.setItem('reset_otp', result.token || '');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyResetToken(token);
      
      if (result.success) {
        setActiveStep(2);
        setMessage('Code verified! Please set your new password.');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, newPassword);
      
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestReset}>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Enter your email address to receive a password reset code.
            </Typography>
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
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
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                },
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyToken}>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Enter the 6-digit code sent to your email.
            </Typography>
            
            <TextField
              fullWidth
              label="6-Digit Code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                },
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setActiveStep(0)}
              sx={{ borderColor: '#667eea', color: '#667eea' }}
            >
              Back to Email
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword}>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Enter your new password.
            </Typography>
            
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="Must be 8+ characters with uppercase, lowercase, and number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
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
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
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
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                },
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        );

      default:
        return null;
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Reset Password
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {renderStepContent()}

        <Box mt={3} textAlign="center">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/login')}
            sx={{ color: '#667eea' }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PasswordReset;