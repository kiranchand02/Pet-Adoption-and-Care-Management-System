import React from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress, Grid } from '@mui/material';
import { Shield, Security, Verified, Warning } from '@mui/icons-material';

const SecurityDashboard: React.FC = () => {
  const securityScore = 85;
  
  const securityFeatures = [
    { name: 'Password Strength', status: 'Strong', color: 'success' as const, icon: <Shield /> },
    { name: '2FA Enabled', status: 'Active', color: 'success' as const, icon: <Security /> },
    { name: 'Email Verified', status: 'Verified', color: 'success' as const, icon: <Verified /> },
    { name: 'Login Attempts', status: '3 today', color: 'warning' as const, icon: <Warning /> }
  ];

  return (
    <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Shield sx={{ mr: 1, color: '#667eea' }} />
          Security Dashboard
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Security Score: {securityScore}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={securityScore} 
            sx={{ 
              mt: 1, 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea, #764ba2)'
              }
            }} 
          />
        </Box>

        <Grid container spacing={2}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={6} key={index}>
              <Box display="flex" alignItems="center" mb={1}>
                {feature.icon}
                <Typography variant="body2" sx={{ ml: 1, flex: 1 }}>
                  {feature.name}
                </Typography>
                <Chip 
                  label={feature.status} 
                  size="small" 
                  color={feature.color}
                  variant="outlined"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SecurityDashboard;