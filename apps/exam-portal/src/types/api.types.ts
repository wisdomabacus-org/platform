/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown> | null;
  error?: {
    code?: string | number;
    message: string;
    details?: unknown;
  };
  timestamp?: string;
  path?: string;
}

// Error response
export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
