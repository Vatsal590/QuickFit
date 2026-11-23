import { admin } from './http.ts';
import { remember } from './basira.ts';
import { drainPending } from './memory-fact.ts';

/** Bounded server-side outbox, not a client API loop. Failed notes remain pending. */
export async function syncMemoryNotes(uid: string, entityId: string) {
  const db = admin();
  const { data: pending, error } = await db.from('training_memory_notes').select('id,text,kind,occurred_at').eq('user_id',uid).is('synced_at',null).order('created_at').limit(3);
  if (error) throw error;
  await drainPending(pending ?? [], async (note) => {
    await remember(entityId, note.text, note.kind, note.occurred_at);
  }, async (note) => {
    const { error: updateError } = await db.from('training_memory_notes').update({ synced_at: new Date().toISOString() }).eq('id',note.id).eq('user_id',uid);
    if (updateError) throw updateError;
  });
}