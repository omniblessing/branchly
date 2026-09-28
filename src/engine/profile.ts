import { ATTRIBUTE_META, type AttributeKey } from "../data/attributes";
import { questionsById } from "../data/questions";
import type { Answers, SpecialtyResult } from "../data/types";

/**
 * Builds the user's expressed preference profile (0–5 per attribute)
 * from the accumulated answer history. Neutral / unsure answers pull
 * the profile toward the middle.
 */
export function buildUserProfile(answers: Answers): Record<string, number> {
  const acc: Record<string, { w: number; v: number }> = {};

  for (const [qid, oid] of Object.entries(answers)) {
    const question = questionsById.get(qid);
    if (!question) continue;
    const isUnsure = oid === "unsure";
    const option = isUnsure ? undefined : question.options.find((o) => o.id === oid);
    if (!option && !isUnsure) continue;

    for (const [key, effect] of Object.entries(option?.effects ?? {})) {
      if (!isUnsure && effect.strength <= 0) continue;
      const dir = isUnsure ? 0 : effect.dir;
      const weight = isUnsure ? 0.2 : effect.strength;
      const entry = (acc[key] ??= { w: 0, v: 0 });
      entry.w += weight;
      entry.v += weight * dir;
    }
  }

  const out: Record<string, number> = {};
  for (const [key, { w, v }] of Object.entries(acc)) {
    if (w <= 0) continue;
    const net = v / w; // -1 .. +1
    out[key] = Math.round(((net + 1) / 2) * 5 * 10) / 10;
  }
  return out;
}

/** Attributes shown as bars on the results profile page, in display order. */
export const PROFILE_DISPLAY: AttributeKey[] = [
  "duty_predictability",
  "emergency_burden",
  "patient_interaction",
  "diagnostic_reasoning",
  "procedural_intensity",
  "longitudinal_patient_relationship",
  "lifestyle_predictability",
  "cognitive_work",
];

export const profileLabel = (key: AttributeKey): string => ATTRIBUTE_META[key].label;

export function rankResults(results: SpecialtyResult[]): SpecialtyResult[] {
  return [...results]
    .filter((r) => r.band !== "eliminated")
    .sort((a, b) => b.score - a.score || a.specialty.name.localeCompare(b.specialty.name));
}

export function compatibilityWord(score: number): string {
  if (score >= 0.72) return "High compatibility";
  if (score >= 0.6) return "Good compatibility";
  if (score >= 0.5) return "Moderate compatibility";
  return "Lower compatibility";
}
