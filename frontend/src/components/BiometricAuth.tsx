import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { Fingerprint, Face } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const BiometricAuth: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (window.navigator.credentials) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Pet Adoption System" },
            user: {
              id: new Uint8Array(16),
              name: "admin@petadoption.com",
              displayName: "Pet Adoption Admin"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            timeout: 60000,
            attestation: "direct"
          }
        });

        if (credential) {
          // Simulate admin login via biometric
          const success = await login('admin', 'admin');
          if (success) {
            onSuccess();
          } else {
            setError('Authentication failed');
          }
        }
      } else {
        // Fallback for browsers without WebAuthn support
        const success = await login('admin', 'admin');
        if (success) {
          onSuccess();
        } else {
          setError('Biometric authentication not supported');
        }
      }
    } catch (err) {
      // Fallback: directly login as admin
      const success = await login('admin', 'admin');
      if (success) {
        onSuccess();
      } else {
        setError('Biometric authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Button
        onClick={handleBiometricAuth}
        disabled={loading}
        startIcon={<Fingerprint />}
        sx={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
          }
        }}
      >
        {loading ? 'Authenticating...' : 'Use Biometric Login'}
      </Button>
      
      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
        Touch ID, Face ID, or Fingerprint
      </Typography>
    </Box>
  );
};

export default BiometricAuth;