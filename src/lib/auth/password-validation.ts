/**
 * Password Validation
 *
 * Provides password strength validation for user registration.
 */

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

/**
 * Password validation requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireLetter: true,
  requireNumber: true,
  requireSpecialChar: false, // Optional
  requireUpperCase: false, // Optional
} as const

/**
 * Validate password against requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`密码长度至少 ${PASSWORD_REQUIREMENTS.minLength} 位`)
  }

  // Check for letter
  if (PASSWORD_REQUIREMENTS.requireLetter && !/[a-zA-Z]/.test(password)) {
    errors.push('密码必须包含至少一个字母')
  }

  // Check for number
  if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
    errors.push('密码必须包含至少一个数字')
  }

  // Optional: Check for special character
  if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码应包含至少一个特殊字符')
  }

  // Optional: Check for uppercase
  if (PASSWORD_REQUIREMENTS.requireUpperCase && !/[A-Z]/.test(password)) {
    errors.push('密码应包含至少一个大写字母')
  }

  const isValid = errors.length === 0
  const strength = calculatePasswordStrength(password)

  return { isValid, errors, strength }
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0

  // Length score
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

/**
 * Check if two passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

/**
 * Hash password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}

/**
 * Common password list for validation (basic set)
 */
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  '123456789',
  'qwerty123',
  'abc12345',
  '11111111',
]

/**
 * Check if password is too common
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate random token for email verification
 */
export function generateVerificationToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
