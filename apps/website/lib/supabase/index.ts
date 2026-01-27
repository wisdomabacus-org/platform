/**
 * Supabase Client Utilities
 * 
 * Export all Supabase client utilities for easy imports:
 * - Browser client: Use in 'use client' components
 * - Server client: Use in Server Components, Actions, Route Handlers
 * - Middleware: Use in middleware.ts for session refresh
 * - Mappers: Convert between DB snake_case and UI camelCase
 */

// Re-export for convenient imports
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
export { updateSession } from './middleware';

// Type mappers
export * from './mappers';
export * from './entity-mappers';
