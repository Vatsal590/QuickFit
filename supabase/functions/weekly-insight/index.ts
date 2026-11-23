import { corsHeaders, json, admin, ai } from "../_shared/http.ts";
import { recall } from "../_shared/basira.ts";

// Scheduled (Mondays). Each run handles up to BATCH users without this week's insight; safe to call repeatedly.
const BATCH = 25;

function weekStart(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x;
}

async function sendEmail(to: string, summary: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;
  const from = Deno.env.get("RESEND_FROM") ?? "QuickFit <onboarding@resend.dev>";
  const html = `<p>${summary.replace(/[<>&]/g, "").replace(/\n/g, "<br>")}</p><p style="color:#888;font-size:12px">You get this because you opted in to weekly insights in QuickFit Memory settings.</p>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: "Your QuickFit week", html }),
  });
  if (!r.ok) console.error("resend", r.status, await r.text());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const db = admin();
  const ws = weekStart().toISOString().slice(0, 10);
  const since = new Date(Date.now() - 14 * 864e5).toISOString();
  const prevWeek = new Date(weekStart().getTime() - 7 * 864e5).toISOString();

  const { data: users } = await db.from("user_memory").select("user_id, entity_id, email_insights_opt_in").not("consent_at", "is", null).not("entity_id", "is", null);
  const { data: done } = await db.from("weekly_insights").select("user_id").eq("week_start", ws);
  const doneSet = new Set((done ?? []).map((d) => d.user_id));
  const todo = (users ?? []).filter((u) => !doneSet.has(u.user_id));
  let processed = 0;

  for (const u of todo) {
    if (processed >= BATCH) break;
    const { data: profile } = await db.from("profiles").select("email, last_used").eq("id", u.user_id).maybeSingle();
    if (!profile?.last_used || profile.last_used < since) continue; // only active users
    processed++;
    try {
      const { count } = await db.from("workouts").select("id", { count: "exact", head: true }).eq("user_id", u.user_id).eq("completed", true).gte("completed_at", prevWeek).lt("completed_at", weekStart().toISOString());
      const facts = await recall(u.entity_id, "workouts, weights, meals and pain during the last 7 days; improvements in load or reps", 25);
      const summary = await ai("You write a short weekly fitness summary (max 4 sentences): sessions done, the best improvement, and one concrete suggestion for next week. Use ONLY the data given; never invent numbers. General fitness guidance, not medical advice.",
        `Completed sessions last week: ${count ?? 0}\nRemembered facts:\n${facts.map((f) => "- " + f.text).join("\n")}`);
      if (!summary) continue;
      await db.from("weekly_insights").upsert({ user_id: u.user_id, week_start: ws, summary }, { onConflict: "user_id,week_start" });
      if (u.email_insights_opt_in && profile.email) await sendEmail(profile.email, summary);
    } catch (e) {
      console.error("weekly insight failed", u.user_id, e);
    }
  }
  return json({ week_start: ws, processed, remaining: Math.max(0, todo.length - processed) });
});
