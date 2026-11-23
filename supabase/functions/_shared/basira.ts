// Thin Basira Cloud adapter. All Basira API details live here — server-side only.
// Shapes follow https://basira.sawm.io/documentation and the official basira_client.py v1.0.0.
const BASE_URL = "https://basira-api.sawm.io/api/v1/basira";
const USER_AGENT = "basira-client/1.0.0 (+https://basira.sawm.io)"; // edge rejects generic agents

const ENTITY_ID_RE = /^ent_[0-9a-f]{32}$/;
const OPAQUE_ID_RE = /^[A-Za-z0-9._~:+/=-]{8,128}$/;
const MAX_FACT_CHARS = 1200;
const RETRYABLE = new Set([
  "429:concurrency_limit_reached", "429:ip_rate_limited",
  "503:engine_unavailable", "503:metering_unavailable", "503:sawm_cloud_unavailable",
  "503:body_reader_capacity_exceeded", "503:basira_temporarily_unavailable",
  "503:deep_recall_queue_timeout",
]);
const GATEWAY = new Set([502, 503, 504, 520, 521, 522, 523, 524]);

export class BasiraError extends Error {
  constructor(public status: number, public code: string, public retryable = false) {
    super(`basira ${status} ${code}`);
  }
}

export type EntityType = "personnage" | "monde" | "service" | "actif";
export type Evidence = { content?: string; title?: string; occurred_at?: string; score?: number; [k: string]: unknown };

function env() {
  const key = Deno.env.get("BASIRA_KEY");
  const space = Deno.env.get("BASIRA_SPACE");
  if (!key || !space) throw new BasiraError(500, "basira_not_configured");
  return { key, space };
}

async function sha(text: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function checkEntity(id: string) {
  if (!ENTITY_ID_RE.test(id)) throw new BasiraError(400, "invalid_entity_id");
}

async function parseError(res: Response): Promise<BasiraError> {
  let code = `http_${res.status}`;
  try {
    const j = await res.json();
    const d = j?.detail;
    if (typeof d === "object" && d?.code) code = d.code;
    else if (res.status === 422) code = "validation_error";
    else if (res.status === 429) code = "ip_rate_limited";
  } catch { /* non-JSON */ }
  const retry = RETRYABLE.has(`${res.status}:${code}`) || GATEWAY.has(res.status);
  return new BasiraError(res.status, code, retry && code !== "monthly_quota_exceeded");
}

function retryDelay(res: Response | null) {
  const ra = Number(res?.headers.get("Retry-After"));
  return Math.min(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 800, 3000);
}

/** One HTTP call; retries ONCE after a short delay on temporary errors, same idempotency key. */
async function request(method: string, path: string, body?: unknown, idemKey?: string, accept = "application/json"): Promise<Response> {
  const { key, space } = env();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`, Accept: accept, "User-Agent": USER_AGENT,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (idemKey) headers["Idempotency-Key"] = idemKey;
  const url = `${BASE_URL}/spaces/${space}${path}`;
  for (let attempt = 0; ; attempt++) {
    let res: Response | null = null;
    try {
      res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
      if (attempt === 0) { await new Promise((r) => setTimeout(r, 800)); continue; }
      throw new BasiraError(0, "transport_error", true);
    }
    if (res.ok) return res;
    const err = await parseError(res);
    if (err.retryable && attempt === 0) { await new Promise((r) => setTimeout(r, retryDelay(res))); continue; }
    throw err;
  }
}

/** POST /spaces/{space}/entities → returns entity_id. `stableKey` makes re-creation idempotent (e.g. "user:<uuid>"). */
export async function createEntity(name: string, opts: { type?: EntityType; stableKey?: string; description?: string } = {}): Promise<string> {
  const payload = { entity_type: opts.type ?? "personnage", name: name.trim().slice(0, 160), description: opts.description ?? "" };
  const key = "entity-create-" + (await sha(opts.stableKey ?? JSON.stringify(payload))).slice(0, 48);
  const res = await request("POST", "/entities", payload, key);
  const j = await res.json();
  if (!ENTITY_ID_RE.test(j?.entity_id ?? "")) throw new BasiraError(502, "invalid_entity_response");
  return j.entity_id;
}

/** POST /spaces/{space}/events:batch with exactly one event. Idempotent per (entity, kind, occurredAt, text). */
export async function remember(entityId: string, text: string, kind: string, occurredAt: string | Date): Promise<{ job_id: string }> {
  checkEntity(entityId);
  const content = String(text ?? "").trim();
  if (!content || content.length > MAX_FACT_CHARS) throw new BasiraError(400, "fact_length_invalid");
  const when = occurredAt instanceof Date ? occurredAt.toISOString() : new Date(occurredAt).toISOString();
  const eventId = "fact-" + (await sha(`${entityId}\0${kind}\0${when}\0${content}`)).slice(0, 40);
  // Basira event kinds are only "message" | "document"; our app-level kind (workout, meal, pain…) goes in the title.
  const body = { entity_id: entityId, events: [{ event_id: eventId, kind: "document", title: kind.slice(0, 512), content, occurred_at: when }] };
  const res = await request("POST", "/events:batch", body, `events-${eventId}`);
  return await res.json();
}

/** POST /spaces/{space}/recall → most relevant past facts. limit 1..159 (single response). */
export async function recall(entityId: string, query: string, limit = 8): Promise<Evidence[]> {
  checkEntity(entityId);
  const q = String(query ?? "").slice(0, 8192);
  if (!q) throw new BasiraError(400, "empty_query");
  const body = { entity_id: entityId, query: q, limit: Math.max(1, Math.min(159, Math.floor(limit))) };
  const res = await request("POST", "/recall", body, `recall-${crypto.randomUUID()}`); // fresh view each call
  const j = await res.json();
  return Array.isArray(j?.evidence) ? j.evidence : [];
}

/** POST /spaces/{space}/sawm/responses (SSE). One memory-aware AI turn; returns the final text after turn.done. */
export async function chat(entityId: string, sessionId: string, turnId: string, message: string, maxOutputTokens = 512): Promise<string> {
  checkEntity(entityId);
  if (!OPAQUE_ID_RE.test(sessionId) || !OPAQUE_ID_RE.test(turnId)) throw new BasiraError(400, "invalid_session_or_turn_id");
  const body = { session_id: sessionId, turn_id: turnId, entity_id: entityId, message: String(message).slice(0, 131072), max_output_tokens: maxOutputTokens };
  const res = await request("POST", "/sawm/responses", body, undefined, "text/event-stream");
  if (!(res.headers.get("Content-Type") ?? "").startsWith("text/event-stream")) throw new BasiraError(502, "not_event_stream");
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "", text = "", done = false, evName: string | null = null, data: string[] = [];
  const flush = () => {
    if (!data.length) return;
    const ev = JSON.parse(data.join("\n")); ev.type ??= evName ?? "message";
    data = []; evName = null;
    if (ev.type === "turn.error") throw new BasiraError(502, String(ev.code ?? "turn_error"), !!ev.retryable);
    if (ev.type === "response.delta" && typeof ev.delta === "string") text += ev.delta;
    if (ev.type === "turn.done") { done = true; if (typeof ev.text === "string" && ev.text) text = ev.text; }
  };
  try {
    while (true) {
      const { value, done: end } = await reader.read();
      if (end) break;
      buf += value;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).replace(/\r$/, ""); buf = buf.slice(i + 1);
        if (!line) { flush(); continue; }
        if (line.startsWith(":")) continue;
        const [name, ...rest] = line.split(":"); let v = rest.join(":"); if (v.startsWith(" ")) v = v.slice(1);
        if (name === "event") evName = v; else if (name === "data") data.push(v);
      }
    }
    flush();
  } catch (e) {
    if (e instanceof BasiraError) throw e;
    throw new BasiraError(0, "stream_interrupted"); // replay with the same turnId to fetch the durable receipt
  }
  if (!done) throw new BasiraError(502, "turn_incomplete");
  return text;
}

/** DELETE /spaces/{space}/entities/{id}: physical purge (needs entities:delete + root admin grant). Used by "Delete my memory". */
export async function deleteEntity(entityId: string): Promise<void> {
  checkEntity(entityId);
  const res = await request("DELETE", `/entities/${entityId}`, undefined, "entity-delete-" + (await sha(entityId)).slice(0, 48));
  const j = await res.json();
  if (j?.entity_id !== entityId || j?.status !== "deleted") throw new BasiraError(502, "invalid_entity_delete_receipt");
}
