import { createContext } from "react";
import type { PoolState, Question } from "../data/types";
import type { Selection } from "../engine/questionSelector";
import type { Answers } from "../data/types";

export interface DiscoveryState {
  answers: Answers;
  skipped: string[];
  asked: string[];
  cursor: number;
}

export interface DiscoveryContextValue {
  state: DiscoveryState;
  pool: PoolState;
  selection: Selection;
  currentQuestion: Question | null;
  currentOptionId: string | null;
  stage: number;
  answeredCount: number;
  canGoBack: boolean;
  isReviewing: boolean;
  answer: (questionId: string, optionId: string) => void;
  skip: (questionId: string) => void;
  back: () => void;
  reset: () => void;
}

export const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);