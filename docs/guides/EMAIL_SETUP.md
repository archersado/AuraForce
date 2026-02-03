# Email Setup Guide

## Current Mode: Development (Console Output)

By default, the application runs in **console output mode** - emails are not actually sent, but the verification codes and tokens are logged in the server console for easy testing.

### What happens when you request a verification email:

1. **Registration**: After signing up, verification code is logged in console
2. **Email Verification**: Resend verification code is logged in console  
3. **Password Reset**: Reset token is logged in console

### How to use verification codes:

1. Start the application: `npm run dev`
2. Watch the server console for output like:
   ```
   Email sending disabled. Would send to: user@example.com Subject: 验证您的 AuraForce 账户
   Password reset token: abc123def456...
   ```
3. Copy the token or code from console and use it in the verification form

## Production SMTP Setup

To enable real email sending in production, configure the following environment variables:

### Required Variables

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@auraforce.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Common SMTP Providers

#### Gmail
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
# Important: Use App Password, not your regular password
# Get it at: https://myaccount.google.com/apppasswords
SMTP_PASS="your-app-password"
```

#### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

#### QQ Mail
```env
SMTP_HOST="smtp.qq.com"
SMTP_PORT="587"
SMTP_USER="your-email@qq.com"
SMTP_PASS="your-authorization-code"
```

#### 163 Mail
```env
SMTP_HOST="smtp.163.com"
SMTP_PORT="465"
SMTP_USER="your-email@163.com"
SMTP_PASS="your-authorization-code"
```

### SMTP Port Guide

| Port | Security | Description |
|------|----------|-------------|
| 25   | None     | Often blocked by ISPs |
| 465  | SSL/TLS  | Explicit SSL |
| 587  | STARTTLS| Standard for most providers |

### Gmail App Password Setup

1. Go to Google Account settings: https://myaccount.google.com
2. Navigate to Security > 2-Step Verification (enable if not already)
3. Scroll to "App passwords"
4. Click "Generate"
5. Name your app (e.g., "AuraForce")
6. Copy the 16-character password (use this as SMTP_PASS)

## Email Templates

### Verification Email
- Subject: `验证您的 AuraForce 账户`
- Contains: Verification button and 6-digit code
- Valid for: 24 hours

### Password Reset Email
- Subject: `重置您的 AuraForce 密码`
- Contains: Reset link
- Valid for: 1 hour

## Troubleshooting

### Email not sending (in production)
1. Check SMTP credentials are correct
2. Verify SMTP port and security settings
3. Check firewall allows outbound SMTP
4. Verify email provider allows sending from your domain

### Gmail authentication errors
- Use App Password, not regular password
- Enable 2-Step Verification first
- Check "Less secure apps" is not blocked (for old method)

### 163/QQ Mail verification failed
- Use SMPT authorization code, not password
- Enable SMTP service in email settings
- Check IP restrictions

## Development Testing

To test email functionality without enabling SMTP:

1. Keep SMTP_HOST empty in `.env`
2. Run the application
3. Trigger an email action (register, reset password)
4. Check server console for:
   - Recipient email address
   - Subject line
   - Token/verification code
   - Full email content preview

## Security Notes

- Never commit `SMTP_PASS` to version control
- Use different passwords for dev/staging/production
- Rotate email passwords regularly
- Monitor email reputation to avoid being marked as spam
- Use SPF, DKIM, and DMARC records for production domains
