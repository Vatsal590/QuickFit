import { memoryCall } from './memory';

export type CoachScope = 'instant' | 'plan' | 'food' | 'diet';
export type CoachSnapshot = Record<string, unknown>;
const snapshots = new Map<CoachScope, CoachSnapshot>();

/** Session-only by default; the server persists only with training-memory consent. */
export function setCoachContext(scope: CoachScope, snapshot: CoachSnapshot | null, persist = false) {
  if (snapshot) snapshots.set(scope, snapshot);
  else snapshots.delete(scope);
  if (snapshot && persist) void memoryCall({ action: 'context', scope, snapshot });
}

export function getCoachContext() { return Object.fromEntries(snapshots); }
export function clearCoachContext() { snapshots.clear(); }

/** Omit media and internal identifiers without dropping sets, weights or nutrition values. */
export function compactContext(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(compactContext);
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).filter(([key]) => !/image|animation|description|howToPerform|user_id/i.test(key))
      .map(([key, item]) => [key, compactContext(item)])
  );
  return value;
}