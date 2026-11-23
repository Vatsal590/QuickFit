import { test, expect } from 'bun:test';
import { resolveCoachConstraints, contextPrompt } from '../supabase/functions/_shared/coach-rules';
import { factKey, hasMemoryConsent, drainPending } from '../supabase/functions/_shared/memory-fact';
import { PRODUCT_ACCESS } from '../supabase/functions/_shared/product-access';

test('QuickFit currently has no paid features or subscription', () => {
  expect(PRODUCT_ACCESS.paidFeatures).toBe(false);
  expect(PRODUCT_ACCESS.subscriptionAvailable).toBe(false);
});

test('memory writes need explicit dated consent', () => {
  expect(hasMemoryConsent(null)).toBe(false);
  expect(hasMemoryConsent({ consent_at: null })).toBe(false);
  expect(hasMemoryConsent({ consent_at: '2026-11-23T18:23:00Z' })).toBe(true);
});

test('the same workout fact has a stable retry key', async () => {
  const key = await factKey('Did 3x8 squats at 40 kg, felt easy','workout','2026-11-23T18:23:00Z');
  expect(await factKey('Did 3x8 squats at 40 kg, felt easy','workout','2026-11-23T18:23:00Z')).toBe(key);
  expect(await factKey('Reported knee pain during lunges','pain','2026-11-23T18:23:00Z')).not.toBe(key);
});

test('a remote outage leaves stored notes pending rather than marking them synced', async () => {
  const marked: string[] = [];
  await expect(drainPending(['Reported knee pain'], async () => { throw new Error('quota'); }, async note => { marked.push(note); })).rejects.toThrow('quota');
  expect(marked).toEqual([]);
});

test('backlog processing is bounded and marks only successful remote writes', async () => {
  const sent: number[] = [], marked: number[] = [];
  await drainPending([1,2,3,4], async n => { sent.push(n); }, async n => { marked.push(n); });
  expect(sent).toEqual([1,2,3]);
  expect(marked).toEqual([1,2,3]);
});

test('dumbbells-only instant selection overrides older barbell profile equipment', () => {
  const result = resolveCoachConstraints({ instant: { preferences: { equipment: ['dumbbells'], time: 30, muscleGroups: ['legs'], intensity: 'moderate' } } }, { profile: { available_equipment: ['barbell', 'bench'] } });
  expect(result.equipment).toEqual(['dumbbells']);
  expect(result.durationMinutes).toBe(30);
  expect(result.muscleGroups).toEqual(['legs']);
});

test('no-equipment selection is not replaced by older equipment', () => {
  expect(resolveCoachConstraints({ instant: { preferences: { equipment: [] } } }, { profile: { available_equipment: ['barbell'] } }).equipment).toEqual([]);
});

test('selected 30-day plan equipment overrides a later profile change', () => {
  expect(resolveCoachConstraints({ plan: { equipment: ['dumbbells'], selectedDay: 8 } }, { profile: { available_equipment: ['barbell'] } }).equipment).toEqual(['dumbbells']);
});

test('missing equipment stays unknown rather than inferred from an exercise', () => {
  expect(resolveCoachConstraints({ instant: { workout: { exercises: [{ name: 'Bench press' }] } } }, {}).equipment).toBeNull();
});

test('exact live prescription and edited food estimates survive context assembly', () => {
  const live = { instant: { currentExercise: { name: 'Dumbbell squat', sets: 3, reps: 8, restTime: 45 } }, food: { status: 'estimated, not logged', foods: [{ name: 'Rice', calories: 210, protein: 4 }] } };
  const prompt = contextPrompt(live, { workoutPlans: [{ daily_workouts: [{ day: 8, completed: false }] }] });
  const reconstructed = JSON.parse(prompt.split('CURRENT SESSION (highest priority, may be empty):\n')[1].split('\nSAVED USER DATA')[0]);
  expect(reconstructed.instant.currentExercise).toEqual({ name: 'Dumbbell squat', sets: 3, reps: 8, restTime: 45 });
  expect(reconstructed.food.foods[0].calories).toBe(210);
  expect(reconstructed.food.status).toBe('estimated, not logged');
});

test('current dietary preferences and allergies take priority', () => {
  const result = resolveCoachConstraints({ diet: { preferences: { diet_preferences: ['Vegan'], food_allergies: ['Peanuts'] } } }, { profile: { diet_preferences: ['Vegetarian'] } });
  expect(result.dietPreferences).toEqual(['Vegan']);
  expect(result.foodAllergies).toEqual(['Peanuts']);
});