import { describe, expect, test } from "bun:test";
import { routeCoachQuestion } from "../src/lib/coachRouting";

const user = { signedIn: true, liveWorkout: false };
describe("Ask Coach Q automatic routing", () => {
  test("product questions go to verified product answers", () => {
    expect(routeCoachQuestion("Is QuickFit free?", user)).toBe("help");
    expect(routeCoachQuestion("How does the AI food tracker work?", user)).toBe("help");
    expect(routeCoachQuestion("How do I delete my training memory?", user)).toBe("help");
  });
  test("fitness questions use personal coaching", () => {
    expect(routeCoachQuestion("I only have dumbbells. Suggest an alternative", user)).toBe("coach");
    expect(routeCoachQuestion("Help me plan my next week", user)).toBe("coach");
  });
  test("live exercise alternatives use the exact active workout", () => {
    expect(routeCoachQuestion("Suggest an alternative with my equipment", { ...user, liveWorkout: true })).toBe("workout");
  });
  test("nutrition stays with the personal coach during workouts", () => {
    expect(routeCoachQuestion("Suggest a meal that fits my goals", { ...user, liveWorkout: true })).toBe("coach");
  });
  test("product questions still work during workouts", () => {
    expect(routeCoachQuestion("Is QuickFit free?", { ...user, liveWorkout: true })).toBe("help");
  });
  test("visitors never dispatch to personal coaching", () => {
    expect(routeCoachQuestion("Remember my knee pain", { signedIn: false, liveWorkout: true, previous: "coach" })).toBe("help");
  });
  test("short follow-ups retain their previous topic", () => {
    expect(routeCoachQuestion("Tell me more", { ...user, previous: "help" })).toBe("help");
    expect(routeCoachQuestion("What about tomorrow?", { ...user, previous: "coach" })).toBe("coach");
    expect(routeCoachQuestion("And now?", { ...user, previous: "workout" })).toBe("coach");
  });
  test("supported languages route product and fitness questions", () => {
    for (const q of ["Est-ce gratuit ?", "Ist QuickFit kostenlos?", "Ass QuickFit gratis?"]) expect(routeCoachQuestion(q, user)).toBe("help");
    for (const q of ["Propose une alternative avec mon équipement", "Schlage eine Alternative mit meiner Ausrüstung vor", "Proposéier eng Alternativ mat mengem Equipement"]) expect(routeCoachQuestion(q, { ...user, liveWorkout: true })).toBe("workout");
  });
});