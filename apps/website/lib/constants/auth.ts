// lib/constants/auth.ts

/**
 * Authentication constants and validation rules
 */

export const AUTH_CONSTANTS = {
  // Password rules
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  
  // Email rules
  EMAIL_MAX_LENGTH: 255,
  
  // Token expiry (for display purposes)
  VERIFICATION_LINK_EXPIRY_HOURS: 24,
  RESET_PASSWORD_LINK_EXPIRY_HOURS: 1,
  
  // Redirect routes
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    HOME: '/',
    PROFILE: '/profile',
  },
  
  // Messages
  MESSAGES: {
    REGISTER_SUCCESS: 'Account created! Please check your email to verify your account.',
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    VERIFICATION_SUCCESS: 'Email verified successfully! You can now login.',
    VERIFICATION_PENDING: 'Please verify your email to continue.',
    RESET_LINK_SENT: 'If an account exists with this email, you will receive a password reset link.',
    PASSWORD_RESET_SUCCESS: 'Password reset successful! Please login with your new password.',
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_TOKEN: 'Invalid or expired verification link',
  },
} as const;

/**
 * Email validation regex
 * Basic RFC 5322 compliant pattern
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength validation
 */
export const PASSWORD_RULES = {
  minLength: AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
  maxLength: AUTH_CONSTANTS.PASSWORD_MAX_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Optional for better UX
};

/**
 * Client-side password validation
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters`);
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_RULES.maxLength} characters`);
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_RULES.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Client-side email validation
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (email.length > AUTH_CONSTANTS.EMAIL_MAX_LENGTH) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}
