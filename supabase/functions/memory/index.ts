import { z } from "npm:zod@3";
import { corsHeaders, json, admin, userId, ai, getMemoryRow } from "../_shared/http.ts";
import { createEntity, remember, recall, deleteEntity, BasiraError } from "../_shared/basira.ts";
import { Snapshot } from '../_shared/coach-context.ts';
import { syncMemoryNotes } from '../_shared/memory-notes.ts';
import { factKey, hasMemoryConsent } from '../_shared/memory-fact.ts';

const KINDS = ["workout", "meal", "weight", "pain", "difficulty", "goal", "preference", "plan"] as const;
const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status") }),
  z.object({ action: z.literal("consent"), email_opt_in: z.boolean().optional() }),
  z.object({ action: z.literal("set_email_opt_in"), value: z.boolean() }),
  z.object({ action: z.literal("remember"), kind: z.enum(KINDS), text: z.string().trim().min(1).max(1100), occurredAt: z.string().datetime().optional() }),
  z.object({ action: z.literal("delete") }),
  z.object({ action: z.literal('context'), scope: z.enum(['instant','plan','food','diet']), snapshot: Snapshot }),
  z.object({ action: z.literal("adapt"), intensity: z.enum(["light", "moderate", "intense"]), muscleGroups: z.array(z.string().max(40)).max(12).default([]), planDay: z.number().int().min(1).max(60).optional(), language: z.string().max(30).default("English") }),
]);

async function ensureEntity(uid: string) {
  // Opaque name: no email or personal data is sent to Basira.
  return await createEntity(`quickfit-user-${uid}`, { type: "personnage", stableKey: `user:${uid}` });
}

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
        return json({ consented: !!row?.consent_at, memory_ready: !!row?.entity_id, consent_at: row?.consent_at ?? null, email_opt_in: row?.email_insights_opt_in ?? false });

      case "consent": {
        // Consent is saved even if the memory service is down; the memory itself is created later.
        const entityId = row?.entity_id ?? await ensureEntity(uid).catch((e) => { console.error("memory consent entity", e instanceof BasiraError ? `${e.status} ${e.code}` : e); return null; });
        const consent_at = row?.consent_at ?? new Date().toISOString();
        const { error } = await db.from("user_memory").upsert({ user_id: uid, entity_id: entityId, consent_at, email_insights_opt_in: body.email_opt_in ?? row?.email_insights_opt_in ?? false });
        if (error) throw error;
        return json({ consented: true, consent_at, memory_ready: !!entityId });
      }

      case "set_email_opt_in": {
        if (!row) return json({ error: "no_consent" }, 409);
        await db.from("user_memory").update({ email_insights_opt_in: body.value }).eq("user_id", uid);
        return json({ ok: true });
      }

      case 'context': {
        if (!hasMemoryConsent(row)) return json({ stored: false, reason: 'no_consent' });
        const { error } = await db.from('coach_context').upsert({ user_id: uid, scope: body.scope, snapshot: body.snapshot });
        if (error) throw error;
        return json({ stored: true });
      }

      case "remember": {
        if (!row || !hasMemoryConsent(row)) return json({ stored: false, reason: "no_consent" });
        const when = body.occurredAt ? new Date(body.occurredAt) : new Date();
        const day = when.toISOString().slice(0, 10);
        const text = `${day} (${body.kind}): ${body.text}`;
        const { error } = await db.from('training_memory_notes').upsert({ user_id: uid, fact_key: await factKey(text,body.kind,when.toISOString()), kind: body.kind, text, occurred_at: when.toISOString() }, { onConflict: 'user_id,fact_key', ignoreDuplicates: true });
        if (error) throw error;
        try {
          const eid = row.entity_id ?? await ensureEntity(uid);
          if (!row.entity_id) await db.from('user_memory').update({ entity_id: eid }).eq('user_id',uid);
          await syncMemoryNotes(uid,eid);
          return json({ stored: true, sync: 'on' });
        } catch { return json({ stored: true, sync: 'pending' }); }
      }

      case "delete": {
        if (row?.entity_id) await deleteEntity(row.entity_id);
        await db.from('coach_context').delete().eq('user_id', uid);
        await db.from('training_memory_notes').delete().eq('user_id',uid);
        await db.from("weekly_insights").delete().eq("user_id", uid);
        await db.from("user_memory").delete().eq("user_id", uid);
        return json({ deleted: true });
      }

      case "adapt": {
        const none = { extraPains: [], intensity: body.intensity, repeat: [], reason: null };
        if (!row?.consent_at) return json({ ...none, memory: "off" });
        const { data: notes } = await db.from('training_memory_notes').select('text').eq('user_id',uid).in('kind',['pain','workout','difficulty','goal']).order('occurred_at',{ascending:false}).limit(30);
        let facts = (notes ?? []).map(n => ({ text: n.text }));
        if (row.entity_id) {
          try { facts = [...facts, ...await recall(row.entity_id, `Recent workouts and how they felt, skipped days, reported pain or injuries, movements the user struggled with, stated fitness goal. Focus on ${body.muscleGroups.join(", ") || "full body"}.`, 20)]; } catch { /* local notes preserve adaptation during an outage */ }
        }
        if (!facts.length) return json({ ...none, memory: "empty" });
        const list = facts.map((f) => `- ${f.text.slice(0, 300)}`).join("\n");
        const today = new Date().toISOString().slice(0, 10);
        const out = await ai(
          `You adapt today's workout from a user's training memory. Today is ${today}. Rules, in priority order:
1. Never contradict a stated injury: any reported injury not explicitly reported as resolved must remain a constraint regardless of its age. Unresolved reported pain must be listed in extraPains (only from: ${PAINS.join(", ")}). Never assume recovery.
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
