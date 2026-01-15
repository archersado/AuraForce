/**
 * Email Service
 *
 * Handles email sending functionality using nodemailer with SMTP
 */

import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface VerificationEmailOptions {
  to: string;
  token: string;
}

export interface PasswordResetEmailOptions {
  to: string;
  token: string;
}

// Create SMTP transporter
function createTransporter() {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'noreply@auraforce.com';

  console.log('[Email Service] SMTP Config:', {
    host: smtpHost ? 'configured' : 'missing',
    port: smtpPort,
    user: smtpUser ? 'configured' : 'missing',
    pass: smtpPass ? 'configured' : 'missing',
  });

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('[Email Service] SMTP not configured. Email sending is disabled.');
    return null;
  }

  // Remove spaces from app password if any
  const cleanPass = smtpPass.replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: cleanPass,
      },
      // Add TLS configuration
      tls: {
        rejectUnauthorized: false, // This may be needed for some SMTP servers
      },
    });

    // Verify connection
    transporter.verify(function (error, success) {
      if (error) {
        console.error('[Email Service] SMTP connection failed:', error.message);
      } else {
        console.log('[Email Service] SMTP server is ready to take our messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('[Email Service] Failed to create transporter:', error);
    return null;
  }
}

let transporterInstance: any = null;

function getTransporter() {
  if (!transporterInstance) {
    transporterInstance = createTransporter();
  }
  return transporterInstance;
}

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log('[Email Service] Email sending disabled. Would send to:', to, 'Subject:', subject);
    console.log('[Email Service] Email content preview:', html.substring(0, 200) + '...');
    return false;
  }

  try {
    const smtpFrom = process.env.SMTP_FROM || 'noreply@auraforce.com';

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });

    console.log('[Email Service] Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    if (error instanceof Error) {
      console.error('[Email Service] Error details:', {
        message: error.message,
        code: (error as any).code,
        command: (error as any).command,
      });
    }
    return false;
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail({ to, token }: VerificationEmailOptions): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = appUrl + '/verify?email=' + to + '&token=' + token;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>验证您的邮箱</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">AuraForce</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #333333; margin-top: 0;">验证您的邮箱</h2>
      <p style="color: #666666; line-height: 1.6;">感谢您注册 AuraForce！点击下面的按钮验证您的邮箱：</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">验证邮箱</a>
      <p style="color: #666666; line-height: 1.6;">或使用验证码：</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 16px; text-align: center; letter-spacing: 2px; margin: 20px 0;">` + token + `</div>
      <p style="color: #666666; line-height: 1.6;">此验证码将在 24 小时后过期。</p>
      <p style="color: #666666; line-height: 1.6;">如果您没有注册，请忽略此邮件。</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
      <p>此邮件由系统自动发送，请勿回复。</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to,
    subject: '验证您的 AuraForce 账户',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({ to, token }: PasswordResetEmailOptions): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = appUrl + '/reset-password?token=' + token;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>重置您的密码</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">AuraForce</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #333333; margin-top: 0;">重置您的密码</h2>
      <p style="color: #666666; line-height: 1.6;">我们收到了您的密码重置请求。点击下面的按钮设置新密码：</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">重置密码</a>
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404;">
        <p><strong>注意：</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>此链接将在 1 小时后过期</li>
          <li>如果您没有请求重置密码，请忽略此邮件</li>
          <li>不要将此链接分享给任何人</li>
        </ul>
      </div>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
      <p>此邮件由系统自动发送，请勿回复。</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to,
    subject: '重置您的 AuraForce 密码',
    html,
  });
}
