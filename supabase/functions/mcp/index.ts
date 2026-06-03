// QuickFit MCP Server
// Implements Model Context Protocol (Streamable HTTP transport) so users can
// connect their QuickFit account to Claude and other MCP-compatible AI clients.
//
// Auth: Bearer token issued from /mcp page in the app. Token hash is stored in
// public.mcp_tokens. The function uses the service role to query the DB but
// scopes EVERY query to the authenticated user_id.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, mcp-session-id, accept",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Expose-Headers": "mcp-session-id",
};

const PROTOCOL_VERSION = "2024-11-05";
const SERVER_INFO = { name: "quickfit-mcp", version: "1.0.0" };

// --- Token hashing ---
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function admin() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function authenticate(req: Request): Promise<string | null> {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1].trim();
  const hash = await sha256Hex(token);
  const sb = admin();
  const { data, error } = await sb
    .from("mcp_tokens")
    .select("user_id, revoked_at")
    .eq("token_hash", hash)
    .is("revoked_at", null)
    .maybeSingle();
  if (error || !data) return null;
  // Best-effort last_used update (don't await failures)
  sb.from("mcp_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token_hash", hash)
    .then(() => {});
  return data.user_id as string;
}

// --- Tool definitions ---
const TOOLS = [
  {
    name: "get_profile",
    description:
      "Get the user's QuickFit fitness profile: height, weight, goal weight, body type, fitness goal, equipment, allergies, diet preferences, and cooking time preferences.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_active_workout_plan",
    description: "Get the user's currently active 30-day workout plan including daily workouts.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_recent_workouts",
    description: "Get the user's most recent workouts (instant or completed).",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max workouts to return (default 10, max 50)" },
        completed_only: { type: "boolean", description: "Only return completed workouts" },
      },
    },
  },
  {
    name: "get_active_diet_plan",
    description:
      "Get the user's currently active diet plan: target macros and daily meals.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_food_logs",
    description: "Get the user's recent food log entries with calories and macros.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max entries (default 20, max 100)" },
        days: { type: "number", description: "Only entries from the last N days" },
      },
    },
  },
  {
    name: "get_nutrition_goals",
    description: "Get the user's daily nutrition targets (calories, protein, carbs, fats, etc).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_weight_history",
    description: "Get the user's weight entries over time.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max entries (default 50, max 365)" },
      },
    },
  },
  {
    name: "get_points",
    description: "Get the user's total points and last workout date.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "log_food",
    description:
      "Log a food entry for the user with calories and macros. 'foods' is a list of items.",
    inputSchema: {
      type: "object",
      properties: {
        foods: {
          type: "array",
          description: "List of food items: [{name, quantity, calories, protein, carbs, fats}]",
          items: { type: "object" },
        },
        meal_type: {
          type: "string",
          description: "One of: breakfast, lunch, dinner, snack",
        },
        total_calories: { type: "number" },
        total_protein: { type: "number" },
        total_carbs: { type: "number" },
        total_fats: { type: "number" },
        notes: { type: "string" },
      },
      required: ["foods", "total_calories"],
    },
  },
  {
    name: "log_weight",
    description: "Record a weight entry for the user.",
    inputSchema: {
      type: "object",
      properties: {
        weight: { type: "number", description: "Weight value (kg)" },
        date: {
          type: "string",
          description: "ISO date YYYY-MM-DD. Defaults to today.",
        },
      },
      required: ["weight"],
    },
  },
  {
    name: "update_nutrition_goals",
    description: "Update the user's daily nutrition targets.",
    inputSchema: {
      type: "object",
      properties: {
        daily_calories: { type: "number" },
        daily_protein: { type: "number" },
        daily_carbs: { type: "number" },
        daily_fats: { type: "number" },
        daily_fiber: { type: "number" },
        daily_sugar: { type: "number" },
        daily_sodium: { type: "number" },
      },
    },
  },
];

// --- Tool implementations ---
async function runTool(name: string, args: any, userId: string): Promise<any> {
  const sb = admin();
  const scope = <T>(q: any) => q.eq("user_id", userId) as T;

  switch (name) {
    case "get_profile": {
      const { data, error } = await sb
        .from("fitness_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { message: "No fitness profile set up yet." };
    }
    case "get_active_workout_plan": {
      const { data, error } = await sb
        .from("workout_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ?? { message: "No active workout plan." };
    }
    case "get_recent_workouts": {
      const limit = Math.min(Math.max(Number(args?.limit) || 10, 1), 50);
      let q = sb.from("workouts").select("*").eq("user_id", userId);
      if (args?.completed_only) q = q.eq("completed", true);
      const { data, error } = await q.order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data ?? [];
    }
    case "get_active_diet_plan": {
      const { data, error } = await sb
        .from("diet_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ?? { message: "No active diet plan." };
    }
    case "get_food_logs": {
      const limit = Math.min(Math.max(Number(args?.limit) || 20, 1), 100);
      let q = sb.from("food_logs").select("*").eq("user_id", userId);
      if (args?.days) {
        const since = new Date(Date.now() - Number(args.days) * 86400000).toISOString();
        q = q.gte("created_at", since);
      }
      const { data, error } = await q.order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return data ?? [];
    }
    case "get_nutrition_goals": {
      const { data, error } = await sb
        .from("user_nutrition_goals")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { message: "Using default nutrition goals." };
    }
    case "get_weight_history": {
      const limit = Math.min(Math.max(Number(args?.limit) || 50, 1), 365);
      const { data, error } = await sb
        .from("weight_entries")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    }
    case "get_points": {
      const { data, error } = await sb
        .from("user_points")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { total_points: 0, last_workout_date: null };
    }
    case "log_food": {
      const row = {
        user_id: userId,
        foods: args?.foods ?? [],
        meal_type: args?.meal_type ?? null,
        total_calories: Number(args?.total_calories) || 0,
        total_protein: Number(args?.total_protein) || 0,
        total_carbs: Number(args?.total_carbs) || 0,
        total_fats: Number(args?.total_fats) || 0,
        notes: args?.notes ?? null,
      };
      const { data, error } = await sb.from("food_logs").insert(row).select().single();
      if (error) throw error;
      return { success: true, entry: data };
    }
    case "log_weight": {
      const row = {
        user_id: userId,
        weight: Number(args?.weight),
        recorded_date: args?.date || new Date().toISOString().slice(0, 10),
      };
      if (!row.weight || Number.isNaN(row.weight)) throw new Error("weight is required");
      const { data, error } = await sb.from("weight_entries").insert(row).select().single();
      if (error) throw error;
      return { success: true, entry: data };
    }
    case "update_nutrition_goals": {
      const payload: Record<string, unknown> = { user_id: userId };
      for (const k of [
        "daily_calories",
        "daily_protein",
        "daily_carbs",
        "daily_fats",
        "daily_fiber",
        "daily_sugar",
        "daily_sodium",
      ]) {
        if (args?.[k] !== undefined && args?.[k] !== null) payload[k] = Number(args[k]);
      }
      // Upsert by user_id
      const { data: existing } = await sb
        .from("user_nutrition_goals")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      let result;
      if (existing) {
        const { data, error } = await sb
          .from("user_nutrition_goals")
          .update(payload)
          .eq("user_id", userId)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await sb
          .from("user_nutrition_goals")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }
      return { success: true, goals: result };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// --- JSON-RPC handler ---
function rpcResult(id: any, result: any) {
  return { jsonrpc: "2.0", id, result };
}
function rpcError(id: any, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function handleRpc(msg: any, userId: string | null): Promise<any | null> {
  const { id, method, params } = msg ?? {};

  // Notifications (no id) — no response
  const isNotification = id === undefined || id === null;

  try {
    switch (method) {
      case "initialize":
        return rpcResult(id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
        });

      case "notifications/initialized":
      case "notifications/cancelled":
        return null;

      case "ping":
        return rpcResult(id, {});

      case "tools/list":
        return rpcResult(id, { tools: TOOLS });

      case "tools/call": {
        if (!userId) return rpcError(id, -32001, "Unauthorized");
        const name = params?.name;
        const args = params?.arguments ?? {};
        if (!name) return rpcError(id, -32602, "Missing tool name");
        const out = await runTool(name, args, userId);
        return rpcResult(id, {
          content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
        });
      }

      case "resources/list":
        return rpcResult(id, { resources: [] });
      case "prompts/list":
        return rpcResult(id, { prompts: [] });

      default:
        if (isNotification) return null;
        return rpcError(id, -32601, `Method not found: ${method}`);
    }
  } catch (e) {
    console.error("RPC error", method, e);
    if (isNotification) return null;
    return rpcError(id, -32603, e instanceof Error ? e.message : String(e));
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Info endpoint
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        protocolVersion: PROTOCOL_VERSION,
        description:
          "QuickFit MCP server. Connect your QuickFit account to Claude or any MCP-compatible AI assistant. Authenticate with: Authorization: Bearer <your-quickfit-mcp-token>",
        endpoint: url.toString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  // Authenticate (initialize/tools/list are allowed unauthenticated so clients
  // can introspect; tools/call requires auth)
  const userId = await authenticate(req);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Batch
  if (Array.isArray(body)) {
    const results = await Promise.all(body.map((m) => handleRpc(m, userId)));
    const filtered = results.filter((r) => r !== null);
    return new Response(filtered.length ? JSON.stringify(filtered) : "", {
      status: filtered.length ? 200 : 202,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const result = await handleRpc(body, userId);
  if (result === null) {
    return new Response("", { status: 202, headers: corsHeaders });
  }
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
