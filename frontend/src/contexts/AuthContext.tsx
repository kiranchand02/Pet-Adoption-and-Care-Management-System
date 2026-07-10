import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendRealOTP } from '../services/realEmailService';
import { SecurityUtils } from '../utils/security';
import { AdvancedSecurity } from '../utils/advancedSecurity';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; token?: string }>;
  verifyResetToken: (token: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Advanced security checks
    const riskScore = AdvancedSecurity.calculateRiskScore();
    const anomalies = AdvancedSecurity.detectAnomalies();
    const deviceFingerprint = AdvancedSecurity.getDeviceFingerprint();
    
    // Log security metrics
    console.log('🔒 Security Analysis:', { riskScore, anomalies, deviceFingerprint });
    
    // Simple authentication logic - in production, this would call an API
    const credentials = [
      { username: 'admin', password: 'admin', role: 'admin' as const },
      { username: 'user', password: 'user', role: 'user' as const }
    ];

    const validCredential = credentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (validCredential) {
      // Mark device as known
      localStorage.setItem('device_known', 'true');
      localStorage.setItem('device_fingerprint', deviceFingerprint);
      
      const userData: User = {
        id: validCredential.username,
        username: validCredential.username,
        role: validCredential.role
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Start behavioral tracking
      AdvancedSecurity.trackUserBehavior();
      
      return true;
    } else {
      // Track failed attempts
      const failed = parseInt(localStorage.getItem('failed_attempts') || '0') + 1;
      localStorage.setItem('failed_attempts', failed.toString());
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
    // Check if email exists in our demo users
    const validEmails = ['admin@petadoption.com', 'user@petadoption.com', 'rahulrohilla237@gmail.com'];
    
    if (validEmails.includes(email)) {
      // Check rate limiting
      if (!SecurityUtils.checkRateLimit(email)) {
        return {
          success: false,
          message: 'Too many attempts. Please try again in 1 hour.'
        };
      }
      
      const { otp: token, expiresAt } = SecurityUtils.generateSecureOTP();
      
      // Store OTP securely with expiry
      localStorage.setItem('reset_otp_data', JSON.stringify({ otp: token, expiresAt, email }));
      
      const emailSent = await sendRealOTP(email, token);
      
      if (emailSent) {
        return {
          success: true,
          message: `Password reset code sent to ${email}. Check your inbox!`,
          token
        };
      } else {
        // Log OTP to console for demo
        console.log(`📧 Demo OTP for ${email}: ${token} (Expires in 10 minutes)`);
        return {
          success: true,
          message: `Password reset code sent to ${email} (Check browser console - F12)`,
          token
        };
      }
    } else {
      return {
        success: false,
        message: 'Email address not found.'
      };
    }
  };

  const verifyResetToken = async (token: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call to verify reset token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedData = localStorage.getItem('reset_otp_data');
    
    if (SecurityUtils.validateOTP(token, storedData || '')) {
      return {
        success: true,
        message: 'Code verified successfully.'
      };
    } else {
      return {
        success: false,
        message: 'Invalid or expired code. Please request a new one.'
      };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call to reset password
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate password strength
    const passwordCheck = SecurityUtils.validatePasswordStrength(newPassword);
    if (!passwordCheck.valid) {
      return {
        success: false,
        message: passwordCheck.message
      };
    }
    
    const storedData = localStorage.getItem('reset_otp_data');
    
    if (SecurityUtils.validateOTP(token, storedData || '')) {
      // Clear all reset data
      localStorage.removeItem('reset_otp_data');
      return {
        success: true,
        message: 'Password reset successfully. You can now login with your new password.'
      };
    } else {
      return {
        success: false,
        message: 'Invalid or expired code. Please start over.'
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};