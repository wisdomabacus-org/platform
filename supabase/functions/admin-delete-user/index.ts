// supabase/functions/admin-delete-user/index.ts
// Edge Function for admin to delete a user (auth + profile)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface DeleteUserRequest {
  userId: string;
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
    const body: DeleteUserRequest = await req.json();
    const { userId } = body;

    if (!userId) {
      return errorResponse("Invalid request: userId required", 400);
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return errorResponse("Cannot delete your own account", 400);
    }

    // Check if target user is an admin
    const { data: targetAdminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    if (targetAdminData) {
      return errorResponse("Cannot delete admin users through this endpoint", 400);
    }

    // Delete auth user (this will cascade to profile if set up, but we'll clean up manually too)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      // If user not found in auth, continue to clean up profile
      if (!deleteAuthError.message.includes('not found')) {
        return errorResponse(`Failed to delete auth user: ${deleteAuthError.message}`, 500);
      }
    }

    // Delete profile
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (deleteProfileError) {
      return errorResponse(`Failed to delete profile: ${deleteProfileError.message}`, 500);
    }

    return jsonResponse({
      success: true,
      data: {
        message: "User deleted successfully",
        userId: userId,
      },
    });

  } catch (error) {
    console.error("admin-delete-user error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
});
