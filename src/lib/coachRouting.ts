export type CoachRoute = "help" | "coach" | "workout";

/** UI dispatch only; authentication and personal context remain server-enforced. */
export function routeCoachQuestion(message: string, options: {
  signedIn: boolean;
  liveWorkout: boolean;
  previous?: CoachRoute;
}): CoachRoute {
  if (!options.signedIn) return "help";
  const q = message.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  // App operations take precedence even when they mention training or nutrition.
  const product = /\b(price|pricing|free|paid|subscription|premium|cost|account|login|sign.?up|privacy|support|feature\w*|delete|memory settings|navigate|upload|tracker|phone|download|browser|prix|gratuit|payant|abonnement|compte|connexion|inscri\w*|confidentialite|supprimer|fonctionnalite\w*|preis|kosten\w*|gratis|bezahlen|abo|konto|anmeld\w*|registr\w*|datenschutz|loschen|funktion\w*|prais|kaascht\w*|bezuel\w*|aschrei\w*|lasch\w*)\b/;
  if (product.test(q) || /\b(how|comment|wie|wei)\b.*\b(app|quickfit|work|fonctionne|funktioniert|funktioneiert|use|utilis\w*|benutz\w*)\b/.test(q)) return "help";
  const fitness = /\b(workout\w*|exercise\w*|equipment|dumbbell\w*|barbell\w*|squat\w*|rep\w*|sets?|pain|injur\w*|knee\w*|alternative|replace\w*|swap|form|technique|train\w*|progress\w*|goal\w*|meal\w*|food|diet|calori\w*|macro\w*|protein\w*|eat|nutrition\w*|weight|rest|plan|entrain\w*|exercice\w*|equipement|haltere\w*|douleur\w*|bless\w*|genou\w*|remplac\w*|objectif\w*|repas|aliment\w*|manger|poids|repos|ubung\w*|ausrust\w*|hantel\w*|schmerz\w*|verletz\w*|knie\w*|ersetz\w*|ziel\w*|essen|mahlzeit\w*|ernahr\w*|gewicht|paus\w*|iessen|ernier\w*|gewiicht|wei\s+deet|equipement|zil\w*)\b/;
  if (fitness.test(q)) {
    const nutrition = /\b(meal\w*|food|diet|calori\w*|macro\w*|protein\w*|eat|nutrition\w*|repas|aliment\w*|manger|essen|mahlzeit\w*|ernahr\w*|iessen|ernier\w*)\b/;
    return options.liveWorkout && !nutrition.test(q) ? "workout" : "coach";
  }
  if (/\b(quickfit|app)\b/.test(q)) return "help";
  // Short follow-ups stay with the preceding answer, not the current page.
  if (options.previous === "workout" && !options.liveWorkout) return "coach";
  return options.previous ?? (options.liveWorkout ? "workout" : "coach");
}