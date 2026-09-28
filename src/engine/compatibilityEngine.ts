import { ATTRIBUTE_META, ATTRIBUTE_ORDER } from "../data/attributes";
import { QUESTIONS, UNSURE_OPTION_ID, questionsById } from "../data/questions";
import { SPECIALTIES } from "../data/specialties";
import type {
  Answers,
  ConflictReason,
  Effect,
  FitReason,
  PoolState,
  Question,
  QuestionOption,
  Specialty,
  SpecialtyResult,
} from "../data/types";
import { clamp01, stddev } from "./math";

export const STRONG_THRESHOLD = 0.6;
export const MODERATE_THRESHOLD = 0.4;
const NEUTRAL_WEIGHT = 0.15;

const ATTRIBUTE_INDEX: Record<string, number> = Object.fromEntries(
  ATTRIBUTE_ORDER.map((key, i) => [key, i]),
);

const attrIndex = (key: string): number => ATTRIBUTE_INDEX[key] ?? -1;

/** Match of a single directional effect against a specialty's attribute value (0..1). */
export function effectMatch(effect: Effect, value: number): number {
  if (effect.dir === 0) return 0.5;
  const t = clamp01(value / 5);
  return effect.dir === 1 ? t : 1 - t;
}

export interface AnswerScore {
  match: number;
  weight: number;
}

/** How well one answer aligns with one specialty (null weight = no signal). */
export function answerScore(question: Question, optionId: string, specialty: Specialty): AnswerScore {
  if (optionId === UNSURE_OPTION_ID) {
    return { match: 0.5, weight: NEUTRAL_WEIGHT };
  }
  const option = question.options.find((o) => o.id === optionId);
  if (!option) return { match: 0.5, weight: 0 };

  let wSum = 0;
  let acc = 0;
  for (const [key, effect] of Object.entries(option.effects)) {
    if (effect.strength <= 0) continue;
    const value = specialty.a[attrIndex(key)];
    acc += effect.strength * effectMatch(effect, value);
    wSum += effect.strength;
  }
  if (wSum === 0) return { match: 0.5, weight: 0 };
  return { match: acc / wSum, weight: wSum / Object.keys(option.effects).length };
}

/** Overall compatibility score (0..1) of a specialty given full answer history. */
export function scoreSpecialty(specialty: Specialty, answers: Answers): number {
  const entries = Object.entries(answers);
  if (entries.length === 0) return 1;

  let acc = 0;
  let wSum = 0;
  let penalty = 0;
  for (const [qid, oid] of entries) {
    const question = questionsById.get(qid);
    if (!question) continue;
    const { match, weight } = answerScore(question, oid, specialty);
    if (weight <= 0) continue;
    acc += match * weight;
    wSum += weight;
    // Non-linear: sustained contradictions dominate rather than being
    // cancelled out by unrelated preferences that happen to align.
    if (match < 0.45) penalty += (0.45 - match) * weight;
  }
  if (wSum === 0) return 0.5;

  const n = entries.length;
  const base = acc / wSum;
  // Early in a session a handful of answers shouldn't hard-cut branches —
  // blend toward neutral, widening the spread as evidence accumulates.
  const spread = Math.min(1, n / 4);
  const blend = 0.5 + (base - 0.5) * spread;

  // Contradiction penalty: sustained mismatches dominate instead of being
  // cancelled by unrelated preferences that happen to align. The penalty
  // deliberately needs 2–3 conflicting answers before it becomes decisive.
  const penFactor = Math.min(1, (penalty * Math.min(1, (n - 1) / 3) * 2.2) / 1);
  return Math.max(0, Math.min(1, blend * (1 - 0.85 * penFactor)));
}

interface HardCheck {
  violated: boolean;
  option?: QuestionOption;
  attribute?: string;
  value?: number;
}

function checkHardFilters(specialty: Specialty, answers: Answers): HardCheck {
  for (const [qid, oid] of Object.entries(answers)) {
    if (oid === UNSURE_OPTION_ID) continue;
    const question = questionsById.get(qid);
    const option = question?.options.find((o) => o.id === oid);
    if (!option?.hardFilters?.length) continue;
    for (const filter of option.hardFilters) {
      const value = specialty.a[attrIndex(filter.attribute)];
      if (filter.max !== undefined && value > filter.max) {
        return { violated: true, option, attribute: filter.attribute, value };
      }
      if (filter.min !== undefined && value < filter.min) {
        return { violated: true, option, attribute: filter.attribute, value };
      }
    }
  }
  return { violated: false };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Signal {
  questionId: string;
  attribute: string;
  weight: number;
  text: string;
}

/** Negative signals: answers that conflict with this specialty's attributes. */
function collectConflicts(specialty: Specialty, answers: Answers): ConflictReason[] {
  const signals: Signal[] = [];

  for (const [qid, oid] of Object.entries(answers)) {
    if (oid === UNSURE_OPTION_ID) continue;
    const question = questionsById.get(qid);
    const option = question?.options.find((o) => o.id === oid);
    if (!option) continue;

    for (const [key, effect] of Object.entries(option.effects)) {
      if (effect.strength < 0.4) continue;
      const value = specialty.a[attrIndex(key)];
      const match = effectMatch(effect, value);
      if (match >= 0.55) continue;

      const meta = ATTRIBUTE_META[key as keyof typeof ATTRIBUTE_META];
      if (!meta) continue;
      const phrase = effect.dir === -1 ? meta.high : meta.low;
      const short = option.short ?? option.label;
      const weight = effect.strength * (0.55 - match) * 2;

      signals.push({
        questionId: qid,
        attribute: key,
        weight,
        text: `“${cap(short)}” — ${specialty.name} typically involves ${phrase}.`,
      });
    }
  }

  return signals
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ questionId, attribute, weight, text }) => ({ questionId, attribute, weight, text }));
}

/** Positive signals: answers this specialty strongly aligns with. */
function collectFits(specialty: Specialty, answers: Answers): FitReason[] {
  const signals: Signal[] = [];

  for (const [qid, oid] of Object.entries(answers)) {
    if (oid === UNSURE_OPTION_ID) continue;
    const question = questionsById.get(qid);
    const option = question?.options.find((o) => o.id === oid);
    if (!option) continue;

    for (const [key, effect] of Object.entries(option.effects)) {
      if (effect.strength < 0.5) continue;
      const value = specialty.a[attrIndex(key)];
      const match = effectMatch(effect, value);
      if (match <= 0.7) continue;

      const meta = ATTRIBUTE_META[key as keyof typeof ATTRIBUTE_META];
      if (!meta) continue;
      const phrase = effect.dir === 1 ? meta.high : meta.low;
      const short = option.short ?? option.label;
      const weight = effect.strength * match;

      signals.push({
        questionId: qid,
        attribute: key,
        weight,
        text: `“${cap(short)}” — ${specialty.name} is associated with ${phrase}.`,
      });
    }
  }

  // Deduplicate by attribute, keep strongest
  const seen = new Map<string, Signal>();
  for (const s of signals.sort((a, b) => b.weight - a.weight)) {
    if (!seen.has(s.attribute)) seen.set(s.attribute, s);
  }

  return [...seen.values()]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(({ questionId, attribute, weight, text }) => ({ questionId, attribute, weight, text }));
}

/** Full recompute of the branch pool from the answer history. Pure. */
export function computePool(answers: Answers): PoolState {
  const results: SpecialtyResult[] = SPECIALTIES.map((specialty) => {
    const score = scoreSpecialty(specialty, answers);
    const hard = checkHardFilters(specialty, answers);
    const conflicts = collectConflicts(specialty, answers);
    const fits = collectFits(specialty, answers);

    let band: SpecialtyResult["band"];
    if (hard.violated) band = "eliminated";
    else if (score >= STRONG_THRESHOLD) band = "strong";
    else if (score >= MODERATE_THRESHOLD) band = "moderate";
    else band = "eliminated";

    const result: SpecialtyResult = {
      specialty,
      score,
      band,
      hardFiltered: hard.violated,
      conflicts,
      fits,
    };

    if (hard.violated && hard.option && hard.attribute) {
      const meta = ATTRIBUTE_META[hard.attribute as keyof typeof ATTRIBUTE_META];
      const phrase = meta?.high ?? "a high level of this work";
      result.conflicts = [
        {
          questionId: "hard-filter",
          attribute: hard.attribute,
          weight: 10,
          text: `You stated “${hard.option.short ?? hard.option.label}”, but ${specialty.name} typically involves ${phrase}.`,
        },
        ...result.conflicts,
      ].slice(0, 3);
    }

    return result;
  });

  const compatible = results.filter((r) => r.band === "strong");
  const lower = results.filter((r) => r.band === "moderate");
  const eliminated = results.filter((r) => r.band === "eliminated");
  const remaining = [...compatible, ...lower].sort((a, b) => b.score - a.score);

  return {
    results,
    remaining,
    compatible: [...compatible].sort((a, b) => b.score - a.score),
    lower: [...lower].sort((a, b) => b.score - a.score),
    eliminated: eliminated.sort((a, b) => b.score - a.score),
    answeredCount: Object.keys(answers).length,
  };
}

/** Expected match per option across a set of specialties — used for discrimination. */
export function questionDiscrimination(question: Question, pool: Specialty[]): number {
  if (pool.length <= 1) return 0;

  let total = 0;
  for (const option of question.options) {
    const scores = pool.map((specialty) => {
      let wSum = 0;
      let acc = 0;
      for (const [key, effect] of Object.entries(option.effects)) {
        if (effect.strength <= 0) continue;
        const value = specialty.a[attrIndex(key)];
        acc += effect.strength * effectMatch(effect, value);
        wSum += effect.strength;
      }
      return wSum === 0 ? 0.5 : acc / wSum;
    });
    total += stddev(scores);
  }
  return total / question.options.length;
}

export const allQuestions = QUESTIONS;
