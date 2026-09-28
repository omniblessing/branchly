import { MAX_QUESTIONS, QUESTIONS } from "../data/questions";
import type { Answers, Question, Specialty } from "../data/types";
import { questionDiscrimination } from "./compatibilityEngine";

export interface SelectionState {
  answers: Answers;
  skipped: string[];
  asked: string[];
  cursor: number;
}

export interface Selection {
  questionId: string | null;
  /** Highest question level ever presented — drives the stage progress UI. */
  stage: number;
  answeredCount: number;
  hasMore: boolean;
}

const levelOf = (id: string): number => QUESTIONS.find((q) => q.id === id)?.level ?? 1;

export function derivedStage(asked: string[]): number {
  return asked.reduce((max, id) => Math.max(max, levelOf(id)), 1);
}

/**
 * Adaptive selector: picks the unanswered question that best discriminates
 * among the specialties still in play, respecting the broad → specific
 * level hierarchy. Deterministic — same state always yields the same pick.
 */
export function selectNextQuestion(state: SelectionState, pool: Specialty[]): Selection {
  const answeredCount = Object.keys(state.answers).length;
  const stage = derivedStage(state.asked);

  const eligible = QUESTIONS.filter(
    (q) => !(q.id in state.answers) && !state.skipped.includes(q.id),
  );

  if (eligible.length === 0 || answeredCount + state.skipped.length >= MAX_QUESTIONS) {
    return { questionId: null, stage, answeredCount, hasMore: eligible.length > 0 };
  }

  const effectivePool = pool.length > 1 ? pool : undefined;

  const pickBest = (maxLevel: number): { q: Question; score: number } | null => {
    const cands = eligible.filter((q) => q.level <= maxLevel);
    if (cands.length === 0) return null;
    let best: { q: Question; score: number } | null = null;
    for (const q of cands) {
      const disc = effectivePool ? questionDiscrimination(q, effectivePool) : 0.15;
      // Slight priority for earlier-level questions while the pool is broad
      const levelBias = (7 - q.level) * 0.003;
      const score = disc + levelBias;
      if (!best || score > best.score) best = { q, score };
    }
    return best;
  };

  let best = pickBest(stage);

  // If current-level questions no longer separate the pool well, open the next level.
  if (best && best.score < 0.103 && stage < 6) {
    const deeper = pickBest(stage + 1);
    if (deeper && deeper.score > best.score) best = deeper;
  }
  if (!best) {
    best = pickBest(6);
    if (!best) {
      return { questionId: null, stage, answeredCount, hasMore: false };
    }
  }

  return {
    questionId: best.q.id,
    stage: Math.max(stage, best.q.level),
    answeredCount,
    hasMore: true,
  };
}
