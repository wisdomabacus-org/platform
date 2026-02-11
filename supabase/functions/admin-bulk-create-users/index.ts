// supabase/functions/admin-bulk-create-users/index.ts
// Edge Function for admin to bulk create users

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface CreateUserRequest {
  email: string;
  password: string;
  studentName?: string;
  parentName?: string;
  studentGrade?: number;
  phone?: string;
  schoolName?: string;
  city?: string;
  state?: string;
}

interface BulkCreateRequest {
  users: CreateUserRequest[];
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify the requester is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse("Unauthorized", 401);
    }

    const supabase = createServiceClient();
    
    // Get the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return errorResponse("Invalid authentication", 401);
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, status')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData || adminData.status !== 'active') {
      return errorResponse("Forbidden: Admin access required", 403);
    }

    // Parse request body
    const body: BulkCreateRequest = await req.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return errorResponse("Invalid request: users array required", 400);
    }

    // Limit batch size
    if (users.length > 100) {
      return errorResponse("Batch size too large. Maximum 100 users per request.", 400);
    }

    const results = {
      successful: [] as { email: string; userId: string }[],
      failed: [] as { email: string; error: string }[],
    };

    // Process each user
    for (const userData of users) {
      try {
        // Generate UID
        const uid = `WM-${Math.floor(1000 + Math.random() * 9000)}`;

        // Create auth user
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.studentName,
            imported: true,
          },
        });

        if (createError) {
          // Check if user already exists
          if (createError.message.includes('already been registered') || 
              createError.message.includes('already exists')) {
            // Try to find existing user
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', userData.email)
              .single();

            if (existingProfile) {
              results.failed.push({
                email: userData.email,
                error: "User already exists",
              });
            } else {
              results.failed.push({
                email: userData.email,
                error: createError.message,
              });
            }
          } else {
            results.failed.push({
              email: userData.email,
              error: createError.message,
            });
          }
          continue;
        }

        const userId = authData.user.id;

        // Create profile
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          uid: uid,
          email: userData.email,
          phone: userData.phone || null,
          auth_provider: 'email',
          student_name: userData.studentName || null,
          parent_name: userData.parentName || null,
          student_grade: userData.studentGrade || null,
          school_name: userData.schoolName || null,
          city: userData.city || null,
          state: userData.state || null,
          is_profile_complete: !!(userData.studentName && userData.studentGrade),
          status: 'active',
          role: 'user',
        });

        if (profileError) {
          // Attempt to clean up auth user if profile creation fails
          await supabase.auth.admin.deleteUser(userId);
          results.failed.push({
            email: userData.email,
            error: `Profile creation failed: ${profileError.message}`,
          });
          continue;
        }

        results.successful.push({
          email: userData.email,
          userId: userId,
        });

      } catch (error: any) {
        results.failed.push({
          email: userData.email,
          error: error.message || "Unknown error",
        });
      }
    }

    return jsonResponse({
      success: true,
      data: {
        total: users.length,
        created: results.successful.length,
        failed: results.failed.length,
        results: results,
      },
    });

  } catch (error) {
    console.error("admin-bulk-create-users error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
});
