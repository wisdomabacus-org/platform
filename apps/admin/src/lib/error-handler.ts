import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Extract human-readable error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  // Handle Supabase PostgrestError
  if (error && typeof error === 'object' && 'message' in error) {
    const pgError = error as PostgrestError;
    
    // Check for specific PostgreSQL error codes
    if (pgError.code) {
      switch (pgError.code) {
        case '42501':
          return 'Permission denied. You may not have access to perform this action.';
        case '23505':
          return 'A record with this information already exists.';
        case '23503':
          return 'This record is referenced by other data and cannot be modified.';
        case '23514':
          return 'The data violates a check constraint.';
        case '42P01':
          return 'Database table not found. Please contact support.';
        case 'PGRST116':
          return 'No data found matching your criteria.';
        case 'PGRST301':
          return 'Database connection error. Please try again.';
        default:
          break;
      }
    }
    
    // Return the message if available
    if (pgError.message && pgError.message !== 'Unknown error') {
      // Clean up common Supabase error messages
      return pgError.message
        .replace(/^JSON object requested, multiple \(or no\) rows returned$/, 'No data found')
        .replace(/^PostgrestError: /, '');
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with error property
  if (error && typeof error === 'object' && 'error' in error) {
    const errObj = error as { error: unknown };
    if (typeof errObj.error === 'string') {
      return errObj.error;
    }
    if (errObj.error && typeof errObj.error === 'object' && 'message' in errObj.error) {
      return (errObj.error as { message: string }).message;
    }
  }
  
  return 'An unexpected error occurred';
}

/**
 * Handle errors from mutations and show appropriate toast notifications
 */
export function handleMutationError(
  error: unknown, 
  options?: {
    fallbackMessage?: string;
    showToast?: boolean;
    context?: string;
  }
): ErrorResponse {
  const { fallbackMessage = 'Operation failed', showToast = true, context } = options || {};
  
  let message = extractErrorMessage(error);
  let code: string | undefined;
  let details: string | undefined;
  
  // Extract additional details from PostgrestError
  if (error && typeof error === 'object') {
    const pgError = error as PostgrestError;
    code = pgError.code;
    details = pgError.details || undefined;
  }
  
  // Use fallback if message is empty or generic
  if (!message || message === 'Unknown error' || message === 'An unexpected error occurred') {
    message = fallbackMessage;
  }
  
  // Add context if provided
  const displayMessage = context ? `${context}: ${message}` : message;
  
  if (showToast) {
    toast.error(displayMessage, {
      description: details,
      duration: 5000,
    });
  }
  
  return { message: displayMessage, code, details };
}

/**
 * Handle successful mutations with toast
 */
export function handleMutationSuccess(
  message: string,
  options?: {
    description?: string;
    duration?: number;
  }
): void {
  const { description, duration = 3000 } = options || {};
  
  toast.success(message, {
    description,
    duration,
  });
}

/**
 * Wrapper for service calls that handles errors consistently
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    fallbackMessage?: string;
    context?: string;
    onError?: (error: ErrorResponse) => void;
  }
): Promise<T> {
  const { fallbackMessage, context, onError } = options || {};
  
  try {
    return await operation();
  } catch (error) {
    const errorResponse = handleMutationError(error, {
      fallbackMessage,
      showToast: true,
      context,
    });
    
    if (onError) {
      onError(errorResponse);
    }
    
    throw error;
  }
}

/**
 * Check if error is an RLS/policy error
 */
export function isRLSError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const pgError = error as PostgrestError;
    return pgError.code === '42501' || // insufficient_privilege
           (pgError.message && pgError.message.toLowerCase().includes('policy'));
  }
  return false;
}

/**
 * Check if error is a not-found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const pgError = error as PostgrestError;
    return pgError.code === 'PGRST116' || 
           (pgError.message && pgError.message.includes('no rows'));
  }
  return false;
}

/**
 * Check if error is a duplicate/conflict error
 */
export function isDuplicateError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const pgError = error as PostgrestError;
    return pgError.code === '23505'; // unique_violation
  }
  return false;
}
