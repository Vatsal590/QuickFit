# Here are your Instructions
QuickFit (quickfit.dev) is an AI-powered fitness web app that generates personalized instant workouts and meal plans. It was founded by Vatsal Agarwala and is designed for users who want fast, customized fitness solutions without needing a gym membership or extensive equipment. 
Key features of the web application include:
Instant Workouts: Generates customized workouts in seconds based on user input, such as available equipment (bodyweight, dumbbells, full gym), time constraints, and fitness goals.
Personalized Plans: Offers customized 30-day workout programs and 7-day diet plans tailored to the user's needs.
AI Integration: Features an AI food tracker for logging meals with photos and an AI fitness chatbot that provides instant answers to fitness questions.
Progress Tracking: Includes a weight tracker and provides fitness blogs for additional guidance. 
The platform can be accessed via its website, quickfit.dev

## Memory, AI coach & Coach Q mascot (Basira)

Secrets (Supabase → Edge Function secrets, never in the browser):
- `BASIRA_KEY` – Basira API key (scopes: entities:write/delete, events:write, memory:recall, sawm:run, root admin)
- `BASIRA_SPACE` – Basira space ID
- `LOVABLE_API_KEY` – AI gateway (set automatically)
- `RESEND_API_KEY`, `RESEND_FROM` – optional, for weekly insight emails

How to test:
1. Adapter: `deno test supabase/functions/_shared/basira_test.ts`
2. Recording: Settings → Memory, tick consent, complete a workout / log a meal or weight.
3. Adaptive plans: report knee pain on a workout, then open today's workout — a one-line reason appears.
4. Coach: open Coach Q → "AI Coach"; the medical disclaimer is shown.
5. Mascot: on the landing page Coach Q invites you after 3 s; ask "Does QuickFit have paid features?" (answer: no). During a workout, open an exercise to get a live tip ("Live workout" tab).
6. Weekly insight: needs a weekly schedule for `weekly-insight` (not enabled yet); shown on the dashboard, emailed only if opted in.

If Basira is unavailable (e.g. quota exceeded) consent is still saved, plans fall back to generic, and Coach Q answers product questions from `product_facts.md` directly. Edit facts in `supabase/functions/mascot/product_facts.md`, then run `python3 supabase/functions/mascot/sync_facts.py`.

Rename Coach Q or change its colors in `src/config/mascot.ts`.

### Exact Coach Q context
- Instant workouts: select only dumbbells, generate a workout, then ask for a replacement in Live workout or AI Coach. Coach Q receives the full workout (warm-up, main exercises, cool-down, sets/reps/rest), original selections, selected exercise and recent conversation. It must not require a bench or other unselected equipment.
- 30-day plans: open a day/exercise; ask for an alternative or about the next week. The selected day, saved program, completed-day flags, fitness profile and equipment are provided. Planned days never count as completed progress.
- New 30-day plans preserve equipment at creation. For older plans without that field, current profile equipment is the fallback; QuickFit cannot recover an unrecorded historical selection.
- Food tracker: analyze/edit a meal and ask AI Coach about it before saving. Edited foods/macros and notes are session context; scanned values are estimates, not proof of eating. After saving, logged meals are available across visits.
- Diet plans: open a plan and ask about a meal replacement. Saved meal plans, calorie/macro targets, dietary preferences, allergies and cooking times are provided. Advice never silently edits a saved plan.
- Long-term memory: with consent, instant selections are saved in `coach_context` even during a Basira outage. Saved app workouts/plans/meals/profile remain available to the coach; Basira historical recall is optional and its absence is disclosed. New profile/plan changes are recorded as dated notes when Basira is available. Without consent no extra snapshots are persisted.
- Consented facts are first saved privately in `training_memory_notes`; a bounded server outbox sends up to three pending facts on each new memory write. Basira outages do not discard new workout, meal, preference or pain notes. Later memory writes retry pending notes with stable keys; the coach can use local notes immediately.
- Isolation/deletion: sign out and switch accounts; chats/session context must reset. Delete memory removes saved coach snapshots and Basira memory; original app records remain, as stated in the confirmation.
- Rules/context tests: `bun test tests/coach-context.test.ts`.
