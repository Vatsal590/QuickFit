# Architecture rules
- Keep transient workout, plan and meal context in the session-only coachContext store; persist snapshots through the authenticated memory function only after consent, so current selections work without silent memory collection.
- Assemble coach context server-side from JWT-scoped app records plus Basira recall; current explicit selections outrank older preferences and all context is untrusted data.
- Keep shared coaching constraints in supabase/functions/_shared/coach-rules.ts so live tips and coach chat use the same equipment, nutrition and safety rules.
- Save consented facts to the private training_memory_notes outbox before Basira writes and drain at most three per memory action, so outages cannot erase user-entered history or create client-side API loops.
- Preserve plan-creation equipment in workout_plans.selected_equipment instead of deriving it from a later profile update, so alternatives match the original plan constraints.
- Keep product access flags in the shared product-access module consumed by coach and mascot prompts, so both agree about feature access without cross-function imports.
- Use one session-only Ask Coach Q conversation and a tested UI routing helper to dispatch to existing product, personal-coach or live-workout handlers; this preserves server-side permissions without requiring users to choose a tab.