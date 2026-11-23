# QuickFit

**QuickFit** is an AI-powered fitness web app that creates personalized workouts, training plans, and meal plans in seconds. It is designed for people who want practical fitness guidance that fits their available equipment, schedule, goals, and preferences.

Website: **https://www.quickfit.dev**  
Founder: **Vatsal Agarwala**

## What QuickFit Does

QuickFit removes the friction of figuring out what to train, what to eat, and how to adapt when life changes. Users can generate an instant workout based on their equipment and available time, build a longer-term training program, create a diet plan, log meals, and track progress—all in one place.

The platform is built to work for beginners as well as more experienced gym-goers. It supports bodyweight-only training, dumbbell setups, and full-gym access, so users can get useful guidance without needing a gym membership or expensive equipment.

## Core Features

### Instant Workouts

QuickFit generates customized workouts in seconds based on:

- Available equipment: bodyweight, dumbbells, or full gym
- Training goal: for example, muscle gain, fat loss, endurance, or general fitness
- Time available
- Fitness level and preferences
- Specific muscle groups or workout type

Each workout includes a structured warm-up, main exercises, cool-down, sets, reps, and rest guidance. Users can also ask for exercise replacements during a workout when an exercise does not suit their equipment, mobility, or preferences.

### 30-Day Training Plans

Users can create personalized 30-day workout programs rather than only single sessions. These plans are tailored to the user’s fitness profile, goals, and available equipment.

QuickFit tracks which planned days have been completed, while planned-but-uncompleted days do not incorrectly count as progress. New plans preserve the equipment selected at creation, helping the app keep recommendations consistent over time.

### 7-Day Diet Plans

QuickFit creates 7-day meal plans based on the user’s goals and dietary needs. Plans can account for:

- Calorie and macro targets
- Dietary preferences
- Allergies
- Cooking time and convenience
- Meal replacements

Users can ask the AI Coach about swaps or alternatives without the app silently changing their saved plan.

### AI Food Tracker

The AI food tracker lets users log meals quickly, including by photo. It estimates foods and macros, allows users to edit entries before saving, and stores logged meals so they remain available across visits.

Scanned or AI-estimated values are treated as estimates, not proof of exactly what was eaten. This keeps the tracker useful while avoiding overly precise claims.

### Progress Tracking

QuickFit includes tools to help users monitor progress over time, including:

- Weight tracking
- Workout completion tracking
- Training history
- Personal fitness profile
- Fitness blogs for extra guidance

## The New AI Coach

QuickFit’s new **AI Coach** acts as a fitness assistant that understands the user’s current workout, plan, meals, profile, and equipment. Instead of giving generic advice, it can respond in the context of what the user is actually doing in the app.

### What the AI Coach Can Do

The AI Coach can help users:

- Replace an exercise in an instant workout
- Suggest alternatives that match available equipment
- Explain how to adapt a workout around pain, fatigue, or missing equipment
- Answer questions about a 30-day plan or upcoming training week
- Suggest meal replacements within a diet plan
- Discuss logged meals, macros, and nutrition targets
- Provide guidance based on saved profile, preferences, allergies, and goals
- Remember relevant training context with user consent

### Coach Q

**Coach Q** is QuickFit’s AI coach and mascot. It appears on the landing page to introduce the product and can answer questions about QuickFit’s features.

During a workout, Coach Q can provide live tips for the selected exercise. In the AI Coach tab, users can have a more detailed conversation about their training, nutrition, plans, and progress.

Coach Q is designed to be helpful, but it is not a replacement for medical advice. QuickFit displays a medical disclaimer in the AI Coach experience.

## Memory and Personalization

With user consent, QuickFit can remember useful context to make future recommendations more relevant. This may include workout selections, completed workouts, logged meals, weight entries, preferences, and reported pain or limitations.

For example, if a user reports knee pain during a workout, QuickFit can use that context when adapting later recommendations. The goal is not to diagnose an injury, but to help the user choose a more suitable alternative and avoid repeating unsuitable movements.

Memory is consent-based. Without consent, QuickFit does not persist extra memory snapshots. Saved workouts, plans, meals, and profile information remain available to the coach as part of the normal app experience.

## Technical Overview

QuickFit uses:

- **Supabase** for authentication, database storage, and Edge Functions
- **Basira** for long-term memory and context recall
- **Lovable AI Gateway** for AI features
- **Resend** for optional weekly insight emails

### Required Secrets

These are stored in Supabase Edge Function secrets and should never be exposed in the browser:

- `BASIRA_KEY` — Basira API key
- `BASIRA_SPACE` — Basira space ID
- `LOVABLE_API_KEY` — AI gateway key
- `RESEND_API_KEY` and `RESEND_FROM` — optional, for weekly insight emails

### Testing the AI Coach

1. Run the Basira adapter test:  
   `deno test supabase/functions/_shared/basira_test.ts`

2. Enable memory in **Settings → Memory**, then complete a workout, log a meal, or record weight.

3. Test adaptive plans by reporting knee pain during a workout, then opening today’s workout to see the adaptation reason.

4. Open **Coach Q → AI Coach** to test the coach and view the medical disclaimer.

5. Test Coach Q on the landing page by asking:  
   “Does QuickFit have paid features?”  
   The expected answer is: **No.**

6. During a workout, open an exercise and use the **Live workout** tab to receive a live tip.

### Resilience

If Basira is unavailable, QuickFit continues to work:

- Consent is still saved
- Plans fall back to generic recommendations
- Coach Q can still answer product questions using `product_facts.md`
- New workout, meal, preference, and pain notes are stored locally
- Pending memory notes are retried later when Basira becomes available

### Customization

- Rename Coach Q or change its colors in `src/config/mascot.ts`
- Edit product facts in `supabase/functions/mascot/product_facts.md`
- Sync updated facts with:  
  `python3 supabase/functions/mascot/sync_facts.py`
