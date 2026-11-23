// Tiny pub/sub so the mascot knows which generated workout/exercise the user is doing right now.
export type LiveWorkout = { title: string; exercise?: { name: string; detail: string } } | null;
let current: LiveWorkout = null;
const subs = new Set<(w: LiveWorkout) => void>();
export const getLiveWorkout = () => current;
export function setLiveWorkout(w: LiveWorkout) { current = w; subs.forEach((f) => f(w)); }
export function subscribeLiveWorkout(f: (w: LiveWorkout) => void) { subs.add(f); return () => { subs.delete(f); }; }
