import { z } from "npm:zod@3";
import { corsHeaders, json, userId, ai } from "../_shared/http.ts";
import { chat, BasiraError } from "../_shared/basira.ts";
import { SessionContext, Conversation, userCoachContext } from '../_shared/coach-context.ts';
import { CONTEXT_RULES } from '../_shared/coach-rules.ts';

const Body = z.object({
  message: z.string().trim().min(1).max(2000),
  sessionId: z.string().regex(/^[A-Za-z0-9._~:+/=-]{8,128}$/),
  turnId: z.string().regex(/^[A-Za-z0-9._~:+/=-]{8,128}$/),
  language: z.string().max(30).default("English"),
  context: SessionContext,
  history: Conversation,
});

const RULES = "You are the QuickFit fitness coach. Give general fitness guidance only, never medical advice; for pain or health conditions suggest seeing a professional. Stay consistent with any advice you gave before.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const uid = await userId(req);
  if (!uid) return json({ error: "unauthorized" }, 401);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const { message, sessionId, turnId, language, context, history } = parsed.data;
  const personal = await userCoachContext(uid, context, message);
  const row = personal.row;
  const input = `${personal.prompt}\nRECENT CONVERSATION:\n${JSON.stringify(history)}\nUSER QUESTION:\n${message}`;
  const rules = `${RULES} ${CONTEXT_RULES} Reply in ${language}, max 6 sentences.`;

  if (row?.consent_at && row.entity_id) {
    try {
      const reply = await chat(row.entity_id, `${uid.slice(0, 8)}-${sessionId}`.slice(0, 128), turnId, `[${rules}]\n${input}`);
      return json({ reply, memory: "on" });
    } catch (e) {
      console.error("coach basira", e instanceof BasiraError ? `${e.status} ${e.code}` : e);
    }
  }
  // Fallback: generic coach without memory.
  const reply = await ai(rules, input);
  if (!reply) return json({ error: "coach_unavailable" }, 503);
  return json({ reply, memory: row?.consent_at ? "unavailable" : "off" });
});
