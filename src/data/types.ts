export type SpecialtyCategory = "clinical" | "diagnostic" | "para-clinical" | "public-health";

export type SourceType =
  | "resident-experience"
  | "reddit"
  | "official"
  | "institutional"
  | "medical-education"
  | "research";

export interface EvidenceItem {
  specialtyId: string;
  attribute: string;
  value: number;
  source: string;
  sourceType: SourceType;
  date: string;
  summary: string;
  confidence: "high" | "moderate" | "low";
}

export interface Specialty {
  id: string;
  name: string;
  degree: string;
  category: SpecialtyCategory;
  tagline: string;
  overview: string;
  typicalWork: string[];
  environments: string[];
  pathways: string[];
  subspecialties: string[];
  advantages: string[];
  tradeoffs: string[];
  residentQuestions: string[];
  /** Attribute values in ATTRIBUTE_ORDER, each 0–5. */
  a: number[];
}

export type FitBand = "strong" | "moderate" | "eliminated";

export interface Effect {
  dir: -1 | 0 | 1;
  strength: number;
}

export interface HardFilter {
  attribute: string;
  /** Specialty value above this is a contradiction (user wants the attribute low). */
  max?: number;
  /** Specialty value below this is a contradiction (user wants the attribute high). */
  min?: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  short?: string;
  effects: Record<string, Effect>;
  hardFilters?: HardFilter[];
}

export interface Question {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  category: string;
  prompt: string;
  context?: string;
  options: QuestionOption[];
}

export type Answers = Record<string, string>;

export interface SpecialtyResult {
  specialty: Specialty;
  score: number;
  band: FitBand;
  hardFiltered: boolean;
  /** Generated reasons for elimination / lower compatibility. */
  conflicts: ConflictReason[];
  /** Generated evidence for why it fits the stated preferences. */
  fits: FitReason[];
}

export interface ConflictReason {
  questionId: string;
  attribute: string;
  text: string;
  weight: number;
}

export interface FitReason {
  questionId: string;
  attribute: string;
  text: string;
  weight: number;
}

export interface PoolState {
  results: SpecialtyResult[];
  remaining: SpecialtyResult[];
  compatible: SpecialtyResult[];
  lower: SpecialtyResult[];
  eliminated: SpecialtyResult[];
  answeredCount: number;
}
