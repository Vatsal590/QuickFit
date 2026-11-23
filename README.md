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
5. Mascot: on the landing page Coach Q invites you after 3 s; ask "How much is QuickFit Pro?". During a workout, open an exercise to get a live tip ("Live workout" tab).
6. Weekly insight: runs every Monday 07:00 UTC (`weekly-insight`); shown on the dashboard, emailed only if opted in.

If Basira is unavailable (e.g. quota exceeded) consent is still saved, plans fall back to generic, and Coach Q answers product questions from `product_facts.md` directly. Edit facts in `supabase/functions/mascot/product_facts.md`, then run `python3 supabase/functions/mascot/sync_facts.py`.

Rename Coach Q or change its colors in `src/config/mascot.ts`.
