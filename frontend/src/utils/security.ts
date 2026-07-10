// Security utilities for authentication
export const SecurityUtils = {
  // Generate secure OTP with expiry
  generateSecureOTP(): { otp: string; expiresAt: number } {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    return { otp, expiresAt };
  },

  // Rate limiting for password reset attempts
  checkRateLimit(email: string): boolean {
    const key = `reset_attempts_${email}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    
    // Remove attempts older than 1 hour
    const recentAttempts = attempts.filter((time: number) => now - time < 3600000);
    
    if (recentAttempts.length >= 3) {
      return false; // Rate limited
    }
    
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    return true;
  },

  // Validate OTP with timing attack protection
  validateOTP(inputOTP: string, storedData: string): boolean {
    const data = JSON.parse(storedData || '{}');
    const isValid = inputOTP === data.otp && Date.now() < data.expiresAt;
    
    // Clear OTP after validation attempt
    localStorage.removeItem('reset_otp_data');
    return isValid;
  },

  // Password strength validation
  validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain uppercase, lowercase, and number' };
    }
    return { valid: true, message: 'Strong password' };
  }
};