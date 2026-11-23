import { z } from 'npm:zod@3';
import { admin, getMemoryRow } from './http.ts';
import { recall } from './basira.ts';
import { contextPrompt } from './coach-rules.ts';

export const Snapshot = z.record(z.unknown()).refine((v) => JSON.stringify(v).length <= 60000, 'Context too large');
export const SessionContext = z.object({ instant: Snapshot.optional(), plan: Snapshot.optional(), food: Snapshot.optional(), diet: Snapshot.optional() }).refine(v => JSON.stringify(v).length <= 60000, 'Session context too large').default({});
export const Conversation = z.array(z.object({ role: z.enum(['user','bot']), text: z.string().max(6000) })).max(12).refine(v => JSON.stringify(v).length <= 20000, 'Conversation too large').default([]);

function compact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(compact);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([k]) => !/image|animation|description|howToPerform|user_id/i.test(k)).map(([k,v]) => [k, compact(v)]));
  return value;
}

/** Every database read is scoped to the verified JWT user, never a client-supplied entity/user id. */
export async function userCoachContext(uid: string, live: Record<string, unknown>, query: string) {
  const db = admin();
  const row = await getMemoryRow(uid);
  const planId = z.object({ planId: z.string().uuid() }).safeParse(live.plan);
  let planQuery = db.from('workout_plans').select('id,plan_name,fitness_goal,selected_equipment,daily_workouts,created_at').eq('user_id',uid);
  planQuery = planId.success ? planQuery.eq('id',planId.data.planId) : planQuery.eq('is_active',true);
  const [profile, plans, diet, meals, goals, workouts, weights, snapshots, notes, constraints] = await Promise.all([
    db.from('fitness_profiles').select('fitness_goal,height,weight,goal_weight,body_type,workout_days_per_week,available_equipment,diet_preferences,food_allergies,taste_preferences,breakfast_cook_time,lunch_cook_time,dinner_cook_time,updated_at').eq('user_id', uid).maybeSingle(),
    planQuery.order('created_at',{ascending:false}).limit(planId.success ? 1 : 2),
    db.from('diet_plans').select('plan_name,daily_meals,target_calories,target_protein,target_carbs,target_fats,cuisine_preferences,created_at').eq('user_id',uid).eq('is_active',true).order('created_at',{ascending:false}).limit(1),
    db.from('food_logs').select('foods,meal_type,notes,total_calories,total_protein,total_carbs,total_fats,created_at').eq('user_id',uid).order('created_at',{ascending:false}).limit(14),
    db.from('user_nutrition_goals').select('daily_calories,daily_protein,daily_carbs,daily_fats').eq('user_id',uid).maybeSingle(),
    db.from('workouts').select('title,duration,intensity,equipment,target_muscle_groups,exercises,completed,completed_at,created_at').eq('user_id',uid).order('created_at',{ascending:false}).limit(8),
    db.from('weight_entries').select('weight,recorded_date').eq('user_id',uid).order('recorded_date',{ascending:false}).limit(8),
    row?.consent_at ? db.from('coach_context').select('scope,snapshot,updated_at').eq('user_id',uid) : Promise.resolve({ data: [] }),
    row?.consent_at ? db.from('training_memory_notes').select('text,kind,occurred_at').eq('user_id',uid).order('occurred_at',{ascending:false}).limit(30) : Promise.resolve({ data: [] }),
    row?.consent_at ? db.from('training_memory_notes').select('text,kind,occurred_at').eq('user_id',uid).in('kind',['pain','goal','preference','difficulty']).order('occurred_at',{ascending:false}).limit(30) : Promise.resolve({ data: [] }),
  ]);
  let facts: string[] = [];
  let memory = row?.consent_at ? 'unavailable' : 'off';
  if (row?.consent_at && row.entity_id) {
    try { facts = (await recall(row.entity_id, `${query}\nRelevant goals, equipment, injuries, difficulty, previous advice, workouts and nutrition history`, 12)).map(f => f.text); memory = 'on'; } catch { /* saved/session context still works */ }
  }
  const saved = compact({ profile: profile.data, rememberedConstraints: constraints.data, trainingNotes: notes.data, nutritionGoals: goals.data, consentedSnapshots: snapshots.data, loggedMeals: meals.data, workouts: workouts.data, weights: weights.data, workoutPlans: plans.data, dietPlans: diet.data });
  return { prompt: contextPrompt(live, saved, facts), memory, row };
}