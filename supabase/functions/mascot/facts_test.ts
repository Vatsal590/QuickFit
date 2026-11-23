import { assertEquals, assert } from "jsr:@std/assert@1";
import { PRODUCT_FACTS_MD } from "./product_facts.ts";
Deno.test("product_facts.ts matches product_facts.md", async () => {
  assertEquals(PRODUCT_FACTS_MD, await Deno.readTextFile(new URL("./product_facts.md", import.meta.url)));
});
Deno.test("each product fact is at most 1200 characters", () => {
  for (const p of PRODUCT_FACTS_MD.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) assert(p.length <= 1200);
});
