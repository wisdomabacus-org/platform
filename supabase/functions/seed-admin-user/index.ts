
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req: Request) => {
    // Handle CORS preflight automatically
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const supabase = createServiceClient();

        // 1. Defined Admin Credentials
        const email = "admin@wisdomabacus.com";
        const password = "password123";
        const name = "System Admin";

        console.log(`Seeding Admin User: ${email}`);

        // 2. Check if user already exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        // Filter manually because listUsers usually returns paginated
        // Ideally we use a filter, but admin.listUsers does not support filters like eq on email easily in all versions?
        // Actually it's cleaner to just try to delete if exists or just CREATE if not.
        // Let's iterate to find if exists.

        let userId = "";
        const existingUser = users?.find(u => u.email === email);

        if (existingUser) {
            console.log("User exists, cleaning up...");
            const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
            if (deleteError) {
                console.error("Failed to delete existing user:", deleteError);
                return errorResponse("Failed to delete existing user: " + deleteError.message, 500);
            }
        }

        // 3. Create new user
        console.log("Creating new user...");
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name }
        });

        if (createError || !newUser.user) {
            console.error("Failed to create user:", createError);
            return errorResponse("Failed to create user: " + (createError?.message || "Unknown"), 500);
        }

        userId = newUser.user.id;
        console.log(`User created with ID: ${userId}`);

        // 4. Create Admin Profile in 'admin_users'
        // This is crucial for the Admin Panel login check
        console.log("Creating admin_users entry...");
        const { error: adminError } = await supabase
            .from("admin_users")
            .upsert({
                id: userId,
                username: email,
                password_hash: "managed-by-supabase-auth", // Dummy value as auth is handled by Supabase
                name: name,
                status: "active"
            });

        if (adminError) {
            console.error("Failed to create admin_users entry:", adminError);
            return errorResponse("Failed to create admin_users entry: " + adminError.message, 500);
        }

        // 5. Create Public Profile in 'profiles'
        // This is important for foreign key constraints and general consistency
        console.log("Creating public profile...");
        const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
                id: userId,
                uid: userId, // or generate a short ID if needed, but userId is safe unique default
                email: email,
                auth_provider: "email",
                phone: null,
                is_profile_complete: true,
                email_verified: true,
                registration_source: "WEB"
            });

        if (profileError) {
            console.error("Failed to create public profile:", profileError);
            return errorResponse("Failed to create public profile: " + profileError.message, 500);
        }

        return jsonResponse({
            success: true,
            message: "Admin user seeded successfully",
            data: {
                id: userId,
                email,
                password
            }
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return errorResponse("Internal Server Error: " + (error instanceof Error ? error.message : String(error)), 500);
    }
});
