import emailjs from '@emailjs/browser';

// Real EmailJS service for sending OTP emails
export const sendRealOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const result = await emailjs.send(
      'service_xvn8qkj', // Gmail service ID
      'template_otp_reset', // Email template ID
      {
        to_name: email.split('@')[0],
        to_email: email,
        otp_code: otp,
        from_name: 'Pet Adoption System',
        subject: 'Password Reset Code',
        message: `Your password reset verification code is: ${otp}`,
        expiry_time: '10 minutes'
      },
      'user_2K8vQJ9mF7kLxB8n' // Public key
    );
    
    console.log('✅ Email sent successfully:', result.text);
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error);
    return false;
  }
};