
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create Supabase service client for admin operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Delete user data from all tables (cascading will handle most of this)
    // But we'll be explicit to ensure everything is cleaned up
    await supabaseService.from("workout_plans").delete().eq("user_id", user.id);
    await supabaseService.from("workouts").delete().eq("user_id", user.id);
    await supabaseService.from("fitness_profiles").delete().eq("user_id", user.id);
    await supabaseService.from("profiles").delete().eq("id", user.id);

    // Delete the user from auth.users (this is the critical part)
    const { error: deleteError } = await supabaseService.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw new Error(`Failed to delete user account: ${deleteError.message}`);
    }

    console.log("User account deleted successfully:", user.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account deleted successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user account:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
