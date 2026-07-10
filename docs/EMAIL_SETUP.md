# Email Setup for Password Reset

## Quick Setup to Send Real Emails

### 1. Install Dependencies
```bash
cd "c:\projects\Dbms Project"
npm install
```

### 2. Configure Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

### 3. Update Email Configuration
Edit `email-server.js` and replace:
```javascript
auth: {
  user: 'rahulrohilla237@gmail.com',  // Your email
  pass: 'your-16-char-app-password'   // Your app password
}
```

### 4. Start Email Server
```bash
node email-server.js
```

### 5. Test the System
1. Start your React app: `npm start`
2. Go to password reset
3. Enter: `rahulrohilla237@gmail.com`
4. Check your actual Gmail inbox for the OTP!

## Alternative: Free EmailJS Setup (No Server Needed)

### 1. Sign up at EmailJS.com
1. Create account at https://emailjs.com
2. Create email service (Gmail)
3. Create email template
4. Get your User ID

### 2. Update AuthContext.tsx
Replace the email sending code with EmailJS configuration.

## Current Status
- ✅ UI ready for real email OTP
- ✅ Email server code ready
- ✅ HTML email template created
- ⏳ Need to configure Gmail credentials

The system will send beautiful HTML emails with OTP codes to `rahulrohilla237@gmail.com`!