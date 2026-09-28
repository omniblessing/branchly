import { useCallback, useMemo, useReducer, type ReactNode } from "react";
import { computePool } from "../engine/compatibilityEngine";
import { derivedStage, selectNextQuestion } from "../engine/questionSelector";
import type { Answers } from "../data/types";
import { questionsById } from "../data/questions";
import {
  DiscoveryContext,
  type DiscoveryContextValue,
  type DiscoveryState,
} from "./discoveryContext";

type Action =
  | { type: "ANSWER"; questionId: string; optionId: string }
  | { type: "SKIP"; questionId: string }
  | { type: "BACK" }
  | { type: "RESET" };

const initialState: DiscoveryState = { answers: {}, skipped: [], asked: [], cursor: 0 };

function advance(state: DiscoveryState, questionId: string, push: boolean): number {
  const idx = state.asked.indexOf(questionId);
  if (idx >= 0) return idx + 1;
  if (push) return state.asked.length + 1; // after the caller pushes it
  return state.cursor;
}

function reducer(state: DiscoveryState, action: Action): DiscoveryState {
  switch (action.type) {
    case "ANSWER": {
      const wasKnown = action.questionId in state.answers;
      const answers: Answers = { ...state.answers, [action.questionId]: action.optionId };
      const known = state.asked.includes(action.questionId) || wasKnown;
      const asked = known ? state.asked : [...state.asked, action.questionId];
      return { ...state, answers, asked, cursor: advance(state, action.questionId, !known) };
    }
    case "SKIP": {
      if (state.skipped.includes(action.questionId)) return state;
      const known = state.asked.includes(action.questionId);
      const asked = known ? state.asked : [...state.asked, action.questionId];
      return {
        ...state,
        skipped: [...state.skipped, action.questionId],
        asked,
        cursor: advance(state, action.questionId, !known),
      };
    }
    case "BACK":
      return { ...state, cursor: Math.max(0, state.cursor - 1) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const pool = useMemo(() => computePool(state.answers), [state.answers]);

  const selection = useMemo(
    () => selectNextQuestion(state, pool.remaining.map((r) => r.specialty)),
    [state, pool],
  );

  const currentQuestionId =
    state.cursor < state.asked.length ? state.asked[state.cursor] : selection.questionId;

  const currentQuestion = currentQuestionId ? questionsById.get(currentQuestionId) ?? null : null;
  const currentOptionId = currentQuestionId ? state.answers[currentQuestionId] ?? null : null;
  const stage = derivedStage(state.asked);
  const answeredCount = Object.keys(state.answers).length;
  const isReviewing = Boolean(
    currentQuestion && currentQuestionId !== null && currentQuestionId in state.answers,
  );

  const answer = useCallback((questionId: string, optionId: string) => {
    dispatch({ type: "ANSWER", questionId, optionId });
  }, []);
  const skip = useCallback((questionId: string) => dispatch({ type: "SKIP", questionId }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value: DiscoveryContextValue = {
    state,
    pool,
    selection,
    currentQuestion,
    currentOptionId,
    stage,
    answeredCount,
    canGoBack: state.cursor > 0,
    isReviewing,
    answer,
    skip,
    back,
    reset,
  };

  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>;
}