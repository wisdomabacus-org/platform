# Seed Admin User Function

This Edge Function is designed to seed a test admin user into the local Supabase instance.
It is public and does not require a JWT, making it easy to call via `curl` or a browser.

## What it does
1. Checks if `admin@wisdomabacus.com` exists.
2. If it exists, deletes the user (Clean Seed).
3. Creates a new user with:
   - Email: `admin@wisdomabacus.com`
   - Password: `password123`
4. Creates/Updates the `public.admin_users` table entry (required for Admin Panel login check).
5. Creates/Updates the `public.profiles` table entry (required for general profile data).

## How to use

### Prerequisites
Ensure your local Supabase instance is running:
```bash
bunx supabase start
```

### Call the Function
Since the function is public, you can invoke it directly via the API Gateway:

```bash
curl -i -X POST http://localhost:54321/functions/v1/seed-admin-user
```

Or run the helper script in the root directory (if created).

### Troubleshooting
If you see a 401 Unauthorized, ensure you passed `--no-verify-jwt` if serving manually, or that your global Supabase config permits public functions (which it should by default for local dev if not strictly enforced). 
This function handles CORS and returns a JSON response.
