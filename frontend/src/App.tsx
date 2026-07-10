import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import EnhancedDashboard from './components/EnhancedDashboard';
import PetManagement from './pages/PetManagement';
import AdopterManagement from './pages/AdopterManagement';
import AdoptionWorkflow from './pages/AdoptionWorkflow';
import VeterinaryRecords from './pages/VeterinaryRecords';
import ShelterManagement from './pages/ShelterManagement';
import Reports from './pages/Reports';
import DonationManagement from './pages/DonationManagement';
import PetCareChatbot from './components/PetCareChatbot';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A90E2',
      light: '#7BB3F0',
      dark: '#2E5C8A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F39C12',
      light: '#F7B731',
      dark: '#D68910',
      contrastText: '#ffffff',
    },
    success: {
      main: '#27AE60',
      light: '#58D68D',
      dark: '#1E8449',
    },
    warning: {
      main: '#E67E22',
      light: '#F39C12',
      dark: '#CA6F1E',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#C0392B',
    },
    info: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 500,
      color: '#34495E',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<EnhancedDashboard />} />
                    <Route path="/pets" element={<PetManagement />} />
                    <Route path="/adopters" element={<AdopterManagement />} />
                    <Route path="/adoptions" element={
                      <ProtectedRoute adminOnly>
                        <AdoptionWorkflow />
                      </ProtectedRoute>
                    } />
                    <Route path="/veterinary" element={
                      <ProtectedRoute adminOnly>
                        <VeterinaryRecords />
                      </ProtectedRoute>
                    } />
                    <Route path="/shelters" element={
                      <ProtectedRoute adminOnly>
                        <ShelterManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute adminOnly>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/donations" element={<DonationManagement />} />
                  </Routes>
                  <PetCareChatbot />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;