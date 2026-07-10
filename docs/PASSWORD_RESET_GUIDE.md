# Password Reset Functionality Guide

## Overview
The Pet Adoption System now includes password reset functionality for both admin and user accounts. This feature allows users to reset their passwords through a secure multi-step process.

## Features Added

### 1. Database Schema Updates
- Added `users` table to store user credentials
- Added `password_reset_tokens` table to manage reset tokens
- Added stored procedures for password reset operations:
  - `GenerateResetToken(email)` - Creates a reset token for the user
  - `VerifyResetToken(token)` - Validates a reset token
  - `ResetPassword(token, new_password_hash)` - Updates the password

### 2. Frontend Components
- **PasswordReset Component**: Multi-step password reset interface
  - Step 1: Enter email address
  - Step 2: Enter reset code/token
  - Step 3: Set new password
- **Updated Login Component**: Added "Forgot Password?" link

### 3. Authentication System
- Enhanced AuthContext with password reset methods
- API service methods for password reset operations
- Secure token-based reset process

## How to Use

### For Users:
1. Go to the login page
2. Click "Forgot Password?" link
3. Enter your email address
4. Check your email for the reset code (in demo mode, the code is displayed on screen)
5. Enter the reset code
6. Set your new password
7. Login with your new credentials

### Demo Credentials:
- **Admin**: email: `admin@petadoption.com`
- **User**: email: `user@petadoption.com`

## Security Features

### Token Security:
- Tokens expire after 1 hour
- Tokens are single-use (marked as used after password reset)
- Tokens are cryptographically secure (in production)

### Password Requirements:
- Minimum 6 characters
- Password confirmation required
- Passwords are hashed before storage (in production)

## Database Procedures Usage

```sql
-- Generate reset token
CALL GenerateResetToken('user@petadoption.com');

-- Verify token
CALL VerifyResetToken('reset_token_here');

-- Reset password
CALL ResetPassword('reset_token_here', 'hashed_new_password');
```

## Implementation Notes

### Current State (Demo):
- Uses mock email validation
- Displays reset tokens on screen for testing
- Simulated API calls with delays

### Production Considerations:
- Integrate with email service (SendGrid, AWS SES, etc.)
- Implement proper password hashing (bcrypt)
- Add rate limiting for reset requests
- Add CAPTCHA for security
- Implement proper token generation (crypto.randomBytes)
- Add audit logging for security events

## File Structure
```
frontend/src/
├── components/
│   ├── Login.tsx (updated)
│   └── PasswordReset.tsx (new)
├── contexts/
│   └── AuthContext.tsx (updated)
└── services/
    └── apiService.ts (updated)

database/
└── pet_adoption_database.sql (updated)
```

## Testing the Feature

1. Start the application
2. Navigate to `/login`
3. Click "Forgot Password?"
4. Use demo email: `admin@petadoption.com` or `user@petadoption.com`
5. Follow the reset process with the displayed token
6. Test login with new password

## Future Enhancements

1. **Email Integration**: Connect with email service provider
2. **SMS Reset**: Add phone number-based reset option
3. **Security Questions**: Add security questions as alternative
4. **Account Lockout**: Implement account lockout after failed attempts
5. **Password History**: Prevent reuse of recent passwords
6. **Two-Factor Authentication**: Add 2FA for enhanced security

## Troubleshooting

### Common Issues:
- **Token not working**: Ensure token is copied correctly and hasn't expired
- **Email not found**: Verify email address is registered in the system
- **Password requirements**: Ensure new password meets minimum requirements

### Error Messages:
- "Email address not found" - Email not in system
- "Invalid or expired token" - Token is wrong or expired
- "Passwords do not match" - Confirmation doesn't match
- "Password must be at least 6 characters" - Password too short