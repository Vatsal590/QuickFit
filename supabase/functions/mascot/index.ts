import { z } from "npm:zod@3";
import { corsHeaders, json, admin, userId, ai, getMemoryRow } from "../_shared/http.ts";
import { PRODUCT_FACTS_MD } from "./product_facts.ts";
import { createEntity, remember, recall, BasiraError } from "../_shared/basira.ts";

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("ask"), message: z.string().trim().min(1).max(500), language: z.string().max(30).default("English") }),
  z.object({ action: z.literal("greet"), language: z.string().max(30).default("English") }),
  z.object({ action: z.literal("workout_tip"), language: z.string().max(30).default("English"), workout: z.string().max(200), exercise: z.string().max(120), detail: z.string().max(300).default(""), question: z.string().trim().max(500).optional() }),
  z.object({ action: z.literal("vote"), question: z.string().max(500), answer: z.string().max(2000), vote: z.union([z.literal(1), z.literal(-1)]) }),
]);

const PERSONA = "You are Coach Q, QuickFit's friendly mascot. Answer in at most 3 short sentences. Be warm and encouraging, never pushy.";

/** Local fallback when the memory service is down: keyword match over the same product facts. */
function localFacts(q: string, limit: number): string[] {
  const words = q.toLowerCase().match(/[\p{L}\d]{3,}/gu) ?? [];
  return PRODUCT_FACTS_MD.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    .map((f) => ({ f, s: words.filter((w) => f.toLowerCase().includes(w)).length }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.f);
}

async function sha(t: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Shared "product" entity, created and seeded once (re-seeded only when product_facts.md changes). */
async function productEntity(): Promise<string> {
  const db = admin();
  const { data: rows } = await db.from("app_settings").select("key,value").in("key", ["product_entity_id", "product_facts_hash"]);
  const get = (k: string) => rows?.find((r) => r.key === k)?.value;
  let id = get("product_entity_id");
  if (!id) {
    id = await createEntity("product", { type: "service", stableKey: "quickfit-product" });
    await db.from("app_settings").upsert({ key: "product_entity_id", value: id });
  }
  const md = PRODUCT_FACTS_MD;
  const hash = await sha(md);
  if (get("product_facts_hash") !== hash) {
    const facts = md.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    for (const f of facts) await remember(id, f.slice(0, 1200), "product_fact", "2026-01-01T00:00:00Z");
    await db.from("app_settings").upsert({ key: "product_facts_hash", value: hash });
  }
  return id;
}

function weekStart(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const body = parsed.data;
  const uid = await userId(req); // null for anonymous visitors: nothing is stored about them

  if (body.action === "vote") {
    await admin().from("mascot_votes").insert({ user_id: uid, question: body.question, answer: body.answer, vote: body.vote });
    return json({ ok: true });
  }

  if (body.action === "workout_tip") {
    if (!uid) return json({ tip: null }, 401);
    const tip = await ai(`${PERSONA} You are coaching the user live during their generated workout. Give one practical tip for the current exercise (form, breathing, tempo or rest) that fits the planned sets/reps. Never change the plan or add exercises. This is general fitness guidance, not medical advice; if the user mentions pain, tell them to stop that exercise and see a professional. Reply in ${body.language}.`,
      `Workout: ${body.workout}\nCurrent exercise: ${body.exercise}\nPlan: ${body.detail}\n${body.question ? "User asks: " + body.question : "Give a tip for this exercise."}`);
    return json({ tip });
  }

  if (body.action === "greet") {
    if (!uid) return json({ greeting: null });
    const db = admin();
    const ws = weekStart(); const prev = new Date(ws); prev.setUTCDate(prev.getUTCDate() - 7);
    const [{ count: thisWeek }, { count: lastWeek }] = await Promise.all([
      db.from("workouts").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("completed", true).gte("completed_at", ws.toISOString()),
      db.from("workouts").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("completed", true).gte("completed_at", prev.toISOString()).lt("completed_at", ws.toISOString()),
    ]);
    let goal = "";
    const row = await getMemoryRow(uid);
    if (row?.consent_at && row.entity_id) {
      try { goal = (await recall(row.entity_id, "the user's stated goal for this week", 3)).map((e) => e.text).join("\n"); } catch { /* memory down */ }
    }
    const text = await ai(`${PERSONA} Greet the user. Only mention facts given below; never invent progress. Reply in ${body.language}.`,
      `Completed workouts this week: ${thisWeek ?? 0}. Last week: ${lastWeek ?? 0}.\nRemembered goal facts (may be empty):\n${goal}`);
    return json({ greeting: text });
  }

  // ask: answer ONLY from recalled product facts.
  let facts: string[] = [];
  try {
    const pid = await productEntity();
    facts = (await recall(pid, body.message, 6)).map((e) => e.text).filter(Boolean);
  } catch (e) {
    const code = e instanceof BasiraError ? `${e.status} ${e.code}` : String((e as Error)?.name ?? "error");
    console.error("mascot memory, using local facts", code);
    facts = localFacts(body.message, 6);
  }
  if (!facts.length) return json({ answer: null, status: "unknown" });
  const out = await ai(
    `${PERSONA} Answer the visitor's question about QuickFit using ONLY the facts below. Never invent features, prices or details. If the facts do not answer the question, reply exactly UNKNOWN. Reply in ${body.language}.\nFacts:\n${facts.map((f) => "- " + f).join("\n")}`,
    body.message);
  if (!out) return json({ answer: null, status: "memory_unavailable" });
  if (/^\W*UNKNOWN\W*$/i.test(out)) return json({ answer: null, status: "unknown" });
  return json({ answer: out, status: "ok" });
});
