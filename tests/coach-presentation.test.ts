import { expect, test } from "bun:test";
import { memoryPresentation, presentationEquipment } from "../src/lib/coachPresentation";

test("memory is not shown as enabled without explicit consent", () => {
  expect(memoryPresentation(null, false)).toBe("unknown");
  expect(memoryPresentation(false, false)).toBe("off");
  expect(memoryPresentation(false, true)).toBe("off");
  expect(memoryPresentation(true, false)).toBe("enabled");
  expect(memoryPresentation(true, true)).toBe("unavailable");
});
test("companion displays selected dumbbells, not inferred exercise equipment", () => {
  expect(presentationEquipment({ preferences: { equipment: ["dumbbells"] }, currentExercise: { equipment: ["barbell"] } })).toEqual(["dumbbells"]);
});
test("explicit plan equipment outranks preferences and empty means no equipment", () => {
  expect(presentationEquipment({ equipment: [], preferences: { equipment: ["barbell"] } })).toEqual([]);
  expect(presentationEquipment({ equipment: ["dumbbells"], preferences: { equipment: ["barbell"] } })).toEqual(["dumbbells"]);
  expect(presentationEquipment({ currentExercise: { equipment: ["barbell"] } })).toBeNull();
});