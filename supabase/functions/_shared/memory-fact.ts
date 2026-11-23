export function hasMemoryConsent(row: { consent_at?: string | null } | null) {
  return !!row?.consent_at && Number.isFinite(Date.parse(row.consent_at));
}

export async function factKey(text: string, kind: string, occurredAt: string) {
  const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify([text,kind,occurredAt])));
  return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/** Mark a fact as synced only after the remote write succeeds. */
export async function drainPending<T>(notes: T[], send: (note: T) => Promise<unknown>, markSynced: (note: T) => Promise<unknown>) {
  for (const note of notes.slice(0,3)) {
    await send(note);
    await markSynced(note);
  }
}