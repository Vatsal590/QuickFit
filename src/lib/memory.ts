import { supabase } from "@/integrations/supabase/client";

export type MemoryKind = "workout" | "meal" | "weight" | "pain" | "difficulty" | "goal";
export type Adaptation = { extraPains: string[]; intensity: "light" | "moderate" | "intense"; repeat: string[]; reason: string | null; memory?: string };

let consentCache: { uid: string; consented: boolean } | null = null;

export async function memoryCall<T = any>(body: Record<string, unknown>): Promise<T | null> {
  try {
    const { data, error } = await supabase.functions.invoke("memory", { body });
    if (error) return null;
    return data as T;
  } catch {
    return null;
  }
}

export async function memoryStatus() {
  const s = await memoryCall<{ consented: boolean; consent_at: string | null; email_opt_in: boolean }>({ action: "status" });
  const { data } = await supabase.auth.getSession();
  if (s && data.session) consentCache = { uid: data.session.user.id, consented: s.consented };
  return s;
}

export function resetMemoryCache() { consentCache = null; }

/** Fire-and-forget: stores one short fact only if the user consented. Never blocks the UI. */
export async function rememberFact(kind: MemoryKind, text: string, occurredAt?: Date) {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid || !text.trim()) return;
  if (!consentCache || consentCache.uid !== uid) await memoryStatus();
  if (!consentCache?.consented) return;
  void memoryCall({ action: "remember", kind, text: text.trim().slice(0, 1100), occurredAt: (occurredAt ?? new Date()).toISOString() });
}

/** Asks memory how to adapt today's workout. Returns null when memory is off/unavailable (generic plan). */
export async function adaptWorkout(intensity: Adaptation["intensity"], muscleGroups: string[]): Promise<Adaptation | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const r = await memoryCall<Adaptation>({ action: "adapt", intensity, muscleGroups, language: localStorage.getItem("quickfit-language") || "English" });
  return r && r.memory === "on" ? r : null;
}
