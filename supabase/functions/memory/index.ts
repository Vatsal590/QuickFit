import { z } from "npm:zod@3";
import { corsHeaders, json, admin, userId, ai, getMemoryRow } from "../_shared/http.ts";
import { createEntity, remember, recall, deleteEntity, BasiraError } from "../_shared/basira.ts";

const KINDS = ["workout", "meal", "weight", "pain", "difficulty", "goal"] as const;
const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status") }),
  z.object({ action: z.literal("consent"), email_opt_in: z.boolean().optional() }),
  z.object({ action: z.literal("set_email_opt_in"), value: z.boolean() }),
  z.object({ action: z.literal("remember"), kind: z.enum(KINDS), text: z.string().trim().min(1).max(1100), occurredAt: z.string().datetime().optional() }),
  z.object({ action: z.literal("delete") }),
  z.object({ action: z.literal("adapt"), intensity: z.enum(["light", "moderate", "intense"]), muscleGroups: z.array(z.string().max(40)).max(12).default([]), planDay: z.number().int().min(1).max(60).optional(), language: z.string().max(30).default("English") }),
]);

const PAINS = ["knee pain", "shoulder pain", "hip pain", "lower back pain", "wrist pain", "ankle pain"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const uid = await userId(req);
  if (!uid) return json({ error: "unauthorized" }, 401);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const body = parsed.data;
  const db = admin();
  const row = await getMemoryRow(uid);

  try {
    switch (body.action) {
      case "status":
        return json({ consented: !!row?.consent_at && !!row?.entity_id, consent_at: row?.consent_at ?? null, email_opt_in: row?.email_insights_opt_in ?? false });

      case "consent": {
        // Opaque name: no email or personal data is sent to Basira.
        const entityId = row?.entity_id ?? await createEntity(`quickfit-user-${uid}`, { type: "personnage", stableKey: `user:${uid}` });
        const consent_at = row?.consent_at ?? new Date().toISOString();
        const { error } = await db.from("user_memory").upsert({ user_id: uid, entity_id: entityId, consent_at, email_insights_opt_in: body.email_opt_in ?? row?.email_insights_opt_in ?? false });
        if (error) throw error;
        return json({ consented: true, consent_at });
      }

      case "set_email_opt_in": {
        if (!row) return json({ error: "no_consent" }, 409);
        await db.from("user_memory").update({ email_insights_opt_in: body.value }).eq("user_id", uid);
        return json({ ok: true });
      }

      case "remember": {
        if (!row?.consent_at || !row.entity_id) return json({ stored: false, reason: "no_consent" });
        const when = body.occurredAt ? new Date(body.occurredAt) : new Date();
        const day = when.toISOString().slice(0, 10);
        await remember(row.entity_id, `${day} (${body.kind}): ${body.text}`, body.kind, when);
        return json({ stored: true });
      }

      case "delete": {
        if (row?.entity_id) await deleteEntity(row.entity_id);
        await db.from("weekly_insights").delete().eq("user_id", uid);
        await db.from("user_memory").delete().eq("user_id", uid);
        return json({ deleted: true });
      }

      case "adapt": {
        const none = { extraPains: [], intensity: body.intensity, repeat: [], reason: null };
        if (!row?.consent_at || !row.entity_id) return json({ ...none, memory: "off" });
        const facts = await recall(row.entity_id, `Recent workouts and how they felt, skipped days, reported pain or injuries, movements the user struggled with, stated fitness goal. Focus on ${body.muscleGroups.join(", ") || "full body"}.`, 20);
        if (!facts.length) return json({ ...none, memory: "empty" });
        const list = facts.map((f) => `- ${f.text.slice(0, 300)}`).join("\n");
        const today = new Date().toISOString().slice(0, 10);
        const out = await ai(
          `You adapt today's workout from a user's training memory. Today is ${today}. Rules, in priority order:
1. Never contradict a stated injury: any pain/injury reported in the last 14 days and not reported as resolved must be listed in extraPains (only from: ${PAINS.join(", ")}).
2. After a reported pain in the last 7 days, lower intensity one level (intense->moderate->light).
3. If the user struggled with a movement, list that movement name in repeat (max 2).
4. Only if the last three sessions were all reported as easy and there is no recent pain, raise intensity one level.
Use ONLY the facts given; never invent. Return JSON {"extraPains": string[], "intensity": "light"|"moderate"|"intense", "repeat": string[], "reason": string|null}. reason is ONE short friendly sentence naming the concrete fact and day (e.g. "Lighter legs today because you reported knee pain on Monday."), or null if nothing changes. Write reason in ${body.language}.`,
          `Requested intensity: ${body.intensity}\nFacts:\n${list}`, { json: true });
        if (!out) return json({ ...none, memory: "unavailable" });
        const r = JSON.parse(out);
        return json({
          extraPains: (Array.isArray(r.extraPains) ? r.extraPains : []).filter((p: string) => PAINS.includes(p)),
          intensity: ["light", "moderate", "intense"].includes(r.intensity) ? r.intensity : body.intensity,
          repeat: (Array.isArray(r.repeat) ? r.repeat : []).slice(0, 2).map(String),
          reason: typeof r.reason === "string" ? r.reason.slice(0, 200) : null,
          memory: "on",
        });
      }
    }
  } catch (e) {
    console.error("memory error", body.action, e instanceof BasiraError ? `${e.status} ${e.code}` : e);
    return json({ error: "memory_unavailable", code: e instanceof BasiraError ? e.code : "internal" }, 503);
  }
});
