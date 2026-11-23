import { assertEquals, assertRejects } from "jsr:@std/assert@1";
Deno.env.set("BASIRA_KEY", "test-key");
Deno.env.set("BASIRA_SPACE", "mem_test");
const { remember, BasiraError } = await import("./basira.ts");
const ENT = "ent_0123456789abcdef0123456789abcdef";

function mockFetch(responses: Array<() => Response>) {
  const calls: Request[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(new Request(input, init));
    return responses[Math.min(calls.length - 1, responses.length - 1)]();
  }) as typeof fetch;
  return calls;
}
const ok = () => new Response(JSON.stringify({ job_id: "job_1", status: "pending" }), { status: 202 });

Deno.test("remember rejects facts longer than 1200 characters", async () => {
  mockFetch([ok]);
  await assertRejects(() => remember(ENT, "x".repeat(1201), "workout", "2026-11-23T10:00:00Z"), BasiraError);
});

Deno.test("the same fact always uses the same idempotency key", async () => {
  const calls = mockFetch([ok]);
  await remember(ENT, "Did 3x8 squats at 40 kg, felt easy", "workout", "2026-11-23T10:00:00Z");
  await remember(ENT, "Did 3x8 squats at 40 kg, felt easy", "workout", "2026-11-23T10:00:00Z");
  await remember(ENT, "Reported knee pain during lunges", "pain", "2026-11-23T10:00:00Z");
  const keys = calls.map((c) => c.headers.get("Idempotency-Key"));
  assertEquals(keys[0], keys[1]);
  assertEquals(keys[0] === keys[2], false);
});

Deno.test("a temporary error is retried exactly once", async () => {
  const busy = () => new Response(JSON.stringify({ detail: { code: "engine_unavailable" } }), { status: 503 });
  const calls = mockFetch([busy, busy, ok]);
  await assertRejects(() => remember(ENT, "Weighed 70 kg", "weight", "2026-11-23T10:00:00Z"), BasiraError);
  assertEquals(calls.length, 2);
});
