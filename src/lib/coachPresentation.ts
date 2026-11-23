export function memoryPresentation(consented: boolean | null, recallUnavailable: boolean) {
  if (consented === null) return "unknown";
  if (!consented) return "off";
  return recallUnavailable ? "unavailable" : "enabled";
}

/** Show explicit selections only, never infer equipment from exercise names. */
export function presentationEquipment(snapshot: Record<string, unknown> | undefined): string[] | null {
  if (!snapshot) return null;
  const preferences = snapshot.preferences;
  const selected = Object.prototype.hasOwnProperty.call(snapshot, "equipment")
    ? snapshot.equipment
    : preferences && typeof preferences === "object" && "equipment" in preferences
      ? preferences.equipment : undefined;
  if (!Array.isArray(selected)) return null;
  return selected.filter((item): item is string => typeof item === "string");
}