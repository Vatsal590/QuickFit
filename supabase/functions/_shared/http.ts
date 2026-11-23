import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
export { corsHeaders };

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

export function admin(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
}

/** Returns the signed-in user id from the caller's JWT, or null. */
export async function userId(req: Request): Promise<string | null> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await admin().auth.getUser(token);
  return error || !data?.user ? null : data.user.id;
}

/** One Lovable AI Gateway call (Responses API, streamed). Returns the final text or null on failure. */
export async function ai(system: string, user: string, opts: { json?: boolean } = {}): Promise<string | null> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return null;
  let runId: string | undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const h = new Headers(init?.headers);
      if (runId) h.set("X-Lovable-AIG-Run-ID", runId);
      const r = await fetch(input, { ...init, headers: h });
      runId ??= r.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
      return r;
    },
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system: system + (opts.json ? "\nRespond with a single JSON object only, no code fences." : ""),
        messages: [{ role: "user", content: user }],
        providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
      });
      let text = "";
      for await (const chunk of result.textStream) text += chunk;
      text = text.trim();
      if (opts.json) text = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
      if (text) return text;
    } catch (e) { console.error("ai error", e); }
    await new Promise((r) => setTimeout(r, 800));
  }
  return null;
}

export async function getMemoryRow(uid: string) {
  const { data } = await admin().from("user_memory").select("*").eq("user_id", uid).maybeSingle();
  return data as null | { user_id: string; entity_id: string | null; consent_at: string | null; email_insights_opt_in: boolean };
}
