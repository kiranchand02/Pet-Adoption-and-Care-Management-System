import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Chip } from '@mui/material';
import { Security, Smartphone } from '@mui/icons-material';

const TwoFactorAuth: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState('');
  const [generatedCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = () => {
    if (code === generatedCode) {
      onSuccess();
    } else {
      setError('Invalid 2FA code');
    }
  };

  return (
    <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Security sx={{ mr: 1, color: '#667eea' }} />
        <Typography variant="h6">Two-Factor Authentication</Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Demo Code: <strong>{generatedCode}</strong> (expires in {timeLeft}s)
      </Alert>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={code.length !== 6 || timeLeft === 0}
        startIcon={<Smartphone />}
        sx={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
          }
        }}
      >
        Verify 2FA Code
      </Button>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Chip label={`Time: ${timeLeft}s`} size="small" color={timeLeft < 10 ? 'error' : 'primary'} />
        <Chip label="SMS Sent" size="small" color="success" />
      </Box>
    </Box>
  );
};

export default TwoFactorAuth;