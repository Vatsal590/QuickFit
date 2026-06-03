## QuickFit MCP Server

Build a Model Context Protocol server so QuickFit users can connect their account to Claude (and any MCP-compatible client) and let the AI access their fitness data and trigger QuickFit features.

### What users see

1. New page **`/mcp`** ("Connect to Claude") on QuickFit:
   - Explains what MCP is.
   - Big button **"Generate Connection Token"** (logged-in users only).
   - Shows the MCP server URL: `https://tlliijookodviezygwqk.supabase.co/functions/v1/mcp`
   - Shows the personal token + a ready-to-paste JSON snippet for Claude Desktop / Claude.ai "Add custom connector".
   - "Revoke token" button.
2. Link to `/mcp` added to the sidebar ("Connect AI Assistant").

### How a user connects in Claude

In Claude's "Add MCP server / connector" UI they paste:
- URL: the edge function URL above
- Header: `Authorization: Bearer <their QuickFit token>`

That's it — Claude then sees the QuickFit tools.

### Tools exposed via MCP

Read tools:
- `get_profile` — fitness profile (height, weight, goal, equipment, allergies, diet prefs).
- `get_active_workout_plan` — current workout plan + daily workouts.
- `get_recent_workouts` — last N completed workouts.
- `get_active_diet_plan` — current diet plan + macros + meals.
- `get_food_logs` — recent food logs with calories/macros.
- `get_nutrition_goals` — daily calorie/protein/carb/fat/etc. targets.
- `get_weight_history` — weight entries over time.
- `get_points` — total points + last workout date.

Write tools:
- `log_food` — add a food log entry (foods, meal_type, calories, macros).
- `log_weight` — add a weight entry for a date.
- `update_nutrition_goals` — update daily targets.

All tools operate strictly on the authenticated user's rows (RLS-safe).

### Technical design

**Library**: `mcp-lite` (≥0.10.0) + `hono`, per Lovable's MCP-on-Edge-Functions guidance. Streamable HTTP transport.

**Auth model** (per-user, not OAuth):
- New table `mcp_tokens(user_id, token_hash, created_at, last_used_at, revoked_at)` with RLS so users only see/manage their own.
- Token = random 32-byte base64url string, shown once on generation, stored only as SHA-256 hash.
- Edge function validates `Authorization: Bearer <token>` by hashing and looking up `mcp_tokens`, then uses `SUPABASE_SERVICE_ROLE_KEY` server-side, scoping every query to the resolved `user_id`. RLS still protects against bugs.

**Edge function**: `supabase/functions/mcp/index.ts`
- `verify_jwt = false` (auth is the bearer MCP token, not a Supabase JWT).
- Handles `OPTIONS` (CORS), `GET /` (info), `POST /` (MCP JSON-RPC via `StreamableHttpTransport`).
- Returns proper CORS headers including `Authorization`.

**Frontend**:
- `src/pages/MCPConnect.tsx` — generation/revocation UI, copy buttons, instructions.
- Route added in `src/App.tsx` under authenticated layout.
- Sidebar entry in `AppSidebar.tsx`.

### Files to create/edit

- DB migration: `mcp_tokens` table + RLS + GRANTs.
- `supabase/functions/mcp/index.ts` (+ `deno.json` with `mcp-lite`, `hono` imports).
- `supabase/config.toml`: add `[functions.mcp] verify_jwt = false`.
- `src/pages/MCPConnect.tsx`.
- `src/App.tsx`: register `/mcp` route.
- `src/components/layout/AppSidebar.tsx`: add nav item.

### Out of scope

- Full OAuth 2.1 dynamic client registration (Claude's MCP connector accepts bearer-token URLs, which is far simpler and matches "user pastes URL + token").
- Streaming SSE responses beyond what `mcp-lite`'s transport handles by default.
- Admin/multi-tenant token management UI.

Confirm and I'll build it.
