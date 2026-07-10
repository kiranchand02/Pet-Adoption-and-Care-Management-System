// Email service for sending OTP codes
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Pet Adoption System - Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #667eea; text-align: center;">Pet Adoption System</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your Pet Adoption System account.</p>
            <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 3px;">${otp}</h1>
              <p style="margin: 10px 0 0 0; color: #666;">Enter this code to reset your password</p>
            </div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Pet Adoption System - Caring for pets, connecting hearts</p>
          </div>
        `
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Alternative: Using a simple SMTP service
export const sendOTPViaSMTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Pet Adoption System - Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">Pet Adoption System</h2>
            <p>You requested a password reset. Use the code below:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    return false;
  }
};