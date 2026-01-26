/**
 * Base API Response structure matching backend
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
  timestamp: string;
  path: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Common query parameters
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * API Error type
 */
export interface ApiError {
  success: false;
  error: {
    code: string | number;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
}
