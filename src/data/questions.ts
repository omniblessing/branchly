import type { Question } from "./types";

export const STAGES = [
  { level: 1, label: "Lifestyle", title: "Working life" },
  { level: 2, label: "Clinical orientation", title: "Type of medicine" },
  { level: 3, label: "Patient relationship", title: "Patient relationship" },
  { level: 4, label: "Clinical domain", title: "Clinical domain" },
  { level: 5, label: "Procedures", title: "Procedures & surgery" },
  { level: 6, label: "Differentiation", title: "Specialty differentiation" },
] as const;

const e = (dir: -1 | 0 | 1, strength: number) => ({ dir, strength });

export const QUESTIONS: Question[] = [
  // ── Level 1: Working life ────────────────────────────────────────────────
  {
    id: "q-emergency",
    level: 1,
    category: "Working life",
    prompt: "How do you feel about being called in for emergencies at unpredictable hours?",
    context: "This shapes compatibility with almost every acute-care and hospital-based branch.",
    options: [
      {
        id: "thrive",
        label: "I enjoy them — that's where I learn fastest",
        short: "enjoy emergencies",
        effects: {
          emergency_burden: e(1, 1),
          night_duty: e(1, 0.7),
          acute_care: e(1, 0.8),
          duty_predictability: e(-1, 0.3),
        },
      },
      {
        id: "tolerate",
        label: "I can tolerate them",
        short: "can tolerate emergencies",
        effects: {
          emergency_burden: e(1, 0.35),
          acute_care: e(1, 0.3),
        },
      },
      {
        id: "avoid",
        label: "I'd rather avoid them as much as possible",
        short: "avoids unpredictable emergencies",
        effects: {
          emergency_burden: e(-1, 1),
          night_duty: e(-1, 0.7),
          acute_care: e(-1, 0.5),
          duty_predictability: e(1, 0.6),
        },
      },
    ],
  },
  {
    id: "q-night-duty",
    level: 1,
    category: "Working life",
    prompt: "How important is limiting night duties and long on-calls in your working life?",
    options: [
      {
        id: "essential",
        label: "Essential — protecting my nights matters a lot",
        short: "wants limited night duty",
        effects: {
          night_duty: e(-1, 1),
          duty_predictability: e(1, 0.8),
          lifestyle_predictability: e(1, 0.8),
        },
      },
      {
        id: "important",
        label: "Important, but I can accept them during training",
        short: "prefers fewer nights",
        effects: {
          night_duty: e(-1, 0.5),
          lifestyle_predictability: e(1, 0.5),
        },
      },
      {
        id: "not-priority",
        label: "Not a priority — I'm fine with a demanding rota",
        short: "accepts heavy night duty",
        effects: {
          night_duty: e(1, 0.6),
          emergency_burden: e(1, 0.3),
        },
      },
    ],
  },
  {
    id: "q-predictability",
    level: 1,
    category: "Working life",
    prompt: "How much does a predictable daily schedule matter to you?",
    options: [
      {
        id: "very",
        label: "Very important — I plan my life around my schedule",
        short: "needs predictable schedule",
        effects: {
          duty_predictability: e(1, 1),
          lifestyle_predictability: e(1, 0.9),
        },
      },
      {
        id: "somewhat",
        label: "Somewhat — routine is nice but not essential",
        short: "prefers some routine",
        effects: {
          duty_predictability: e(1, 0.5),
          lifestyle_predictability: e(1, 0.4),
        },
      },
      {
        id: "variety",
        label: "I prefer variety and don't mind unpredictability",
        short: "comfortable with unpredictable days",
        effects: {
          duty_predictability: e(-1, 0.45),
          emergency_burden: e(1, 0.3),
        },
      },
    ],
  },
  {
    id: "q-workload",
    level: 1,
    category: "Working life",
    prompt: "What kind of daily workload suits you best?",
    options: [
      {
        id: "heavy",
        label: "Heavy, high-volume days — I want to stay busy",
        short: "wants high-volume workload",
        effects: {
          OPD_intensity: e(1, 0.7),
          IPD_intensity: e(1, 0.7),
          lifestyle_predictability: e(-1, 0.4),
        },
      },
      {
        id: "balanced",
        label: "A balanced mix of clinical and downtime",
        short: "wants balanced workload",
        effects: {
          duty_predictability: e(1, 0.3),
        },
      },
      {
        id: "protected",
        label: "I want workload that leaves room for life outside medicine",
        short: "wants protected personal time",
        effects: {
          lifestyle_predictability: e(1, 0.85),
          OPD_intensity: e(-1, 0.35),
          IPD_intensity: e(-1, 0.35),
        },
      },
    ],
  },
  {
    id: "q-lifestyle-weight",
    level: 1,
    category: "Working life",
    prompt: "Beyond medicine, how much weight do you place on protecting personal time — family, hobbies, side projects?",
    options: [
      {
        id: "high",
        label: "A lot — medicine is my work, not my whole life",
        short: "prioritises personal time",
        effects: {
          lifestyle_predictability: e(1, 1),
          night_duty: e(-1, 0.6),
          emergency_burden: e(-1, 0.4),
        },
      },
      {
        id: "moderate",
        label: "A moderate amount",
        short: "balanced lifestyle weight",
        effects: {
          lifestyle_predictability: e(1, 0.45),
        },
      },
      {
        id: "low",
        label: "Little — I want a medicine-first intensive career",
        short: "medicine-first intensity",
        effects: {
          emergency_burden: e(1, 0.4),
          IPD_intensity: e(1, 0.3),
        },
      },
    ],
  },

  // ── Level 2: Type of medicine ────────────────────────────────────────────
  {
    id: "q-day-environment",
    level: 2,
    category: "Type of medicine",
    prompt: "Where would you rather spend most of your working day?",
    options: [
      {
        id: "patients",
        label: "Face-to-face with patients in consults and examinations",
        short: "patient-facing days",
        effects: {
          patient_interaction: e(1, 1),
          communication_intensity: e(1, 0.7),
          imaging_orientation: e(-1, 0.5),
          laboratory_orientation: e(-1, 0.5),
        },
      },
      {
        id: "images",
        label: "With scans, images and screens — interpreting studies",
        short: "image and screen-based work",
        effects: {
          imaging_orientation: e(1, 1),
          diagnostic_reasoning: e(1, 0.7),
          patient_interaction: e(-1, 0.7),
        },
      },
      {
        id: "lab",
        label: "In the laboratory, working with samples and systems",
        short: "laboratory-based work",
        effects: {
          laboratory_orientation: e(1, 1),
          patient_interaction: e(-1, 0.7),
          hands_on_work: e(1, 0.4),
        },
      },
    ],
  },
  {
    id: "q-cognitive-hands",
    level: 2,
    category: "Type of medicine",
    prompt: "What kind of daily work gives you more satisfaction?",
    options: [
      {
        id: "thinking",
        label: "Thinking through complex problems and differentials",
        short: "cognitive problem-solving",
        effects: {
          cognitive_work: e(1, 1),
          diagnostic_reasoning: e(1, 0.8),
          hands_on_work: e(-1, 0.6),
        },
      },
      {
        id: "hands",
        label: "Working with my hands — instruments, procedures, skills",
        short: "hands-on technical work",
        effects: {
          hands_on_work: e(1, 1),
          procedural_intensity: e(1, 0.8),
          cognitive_work: e(-1, 0.3),
        },
      },
      {
        id: "mix",
        label: "An even mix of both",
        short: "mix of thinking and hands",
        effects: {
          cognitive_work: e(1, 0.35),
          hands_on_work: e(1, 0.35),
        },
      },
    ],
  },
  {
    id: "q-acute-chronic",
    level: 2,
    category: "Type of medicine",
    prompt: "Do you prefer treating acute, time-sensitive problems or managing long-term conditions?",
    options: [
      {
        id: "acute",
        label: "Acute and time-sensitive — act now, stabilise, move",
        short: "prefers acute medicine",
        effects: {
          acute_care: e(1, 1),
          emergency_burden: e(1, 0.5),
          chronic_care: e(-1, 0.5),
        },
      },
      {
        id: "chronic",
        label: "Long-term conditions — follow patients through their illness",
        short: "prefers chronic care",
        effects: {
          chronic_care: e(1, 1),
          longitudinal_patient_relationship: e(1, 0.8),
          acute_care: e(-1, 0.5),
        },
      },
      {
        id: "both",
        label: "Both equally",
        short: "enjoys acute and chronic equally",
        effects: {
          acute_care: e(1, 0.3),
          chronic_care: e(1, 0.3),
        },
      },
    ],
  },
  {
    id: "q-diagnostic-draw",
    level: 2,
    category: "Type of medicine",
    prompt: "How much do you enjoy diagnostic reasoning — building a differential and working it out?",
    options: [
      {
        id: "core",
        label: "It's the core appeal of medicine for me",
        short: "loves diagnostic reasoning",
        effects: {
          diagnostic_reasoning: e(1, 1),
          cognitive_work: e(1, 0.7),
        },
      },
      {
        id: "action",
        label: "I'd rather act and intervene than deliberate",
        short: "prefers action over deliberation",
        effects: {
          diagnostic_reasoning: e(-1, 0.5),
          hands_on_work: e(1, 0.6),
          procedural_intensity: e(1, 0.4),
        },
      },
      {
        id: "indifferent",
        label: "Indifferent — it comes with the job",
        short: "neutral on diagnostics",
        effects: {
          diagnostic_reasoning: e(1, 0.2),
        },
      },
    ],
  },

  // ── Level 3: Patient relationship ───────────────────────────────────────
  {
    id: "q-longitudinal",
    level: 3,
    category: "Patient relationship",
    prompt: "How important is building long-term relationships with the same patients over years?",
    options: [
      {
        id: "very",
        label: "Very important — continuity is why I'd see patients",
        short: "wants long-term patient relationships",
        effects: {
          longitudinal_patient_relationship: e(1, 1),
          patient_interaction: e(1, 0.6),
          chronic_care: e(1, 0.6),
        },
      },
      {
        id: "nice",
        label: "Nice to have, but not decisive",
        short: "open to continuity",
        effects: {
          longitudinal_patient_relationship: e(1, 0.4),
        },
      },
      {
        id: "no",
        label: "I'd rather not — episodic encounters suit me",
        short: "prefers episodic encounters",
        effects: {
          longitudinal_patient_relationship: e(-1, 0.85),
          patient_interaction: e(-1, 0.4),
        },
      },
    ],
  },
  {
    id: "q-communication",
    level: 3,
    category: "Patient relationship",
    prompt: "How much do you enjoy sustained counselling, persuasion and difficult conversations with patients and families?",
    options: [
      {
        id: "best",
        label: "One of the best parts of the job",
        short: "loves counselling work",
        effects: {
          communication_intensity: e(1, 1),
          patient_interaction: e(1, 0.6),
          mental_health_exposure: e(1, 0.3),
        },
      },
      {
        id: "fine",
        label: "I can do it well, but it's not the draw",
        short: "competent but not drawn to counselling",
        effects: {
          communication_intensity: e(1, 0.3),
        },
      },
      {
        id: "less",
        label: "I'd prefer less of it and more objectivity",
        short: "prefers less counselling",
        effects: {
          communication_intensity: e(-1, 0.9),
          patient_interaction: e(-1, 0.5),
          laboratory_orientation: e(1, 0.3),
        },
      },
    ],
  },
  {
    id: "q-continuity",
    level: 3,
    category: "Patient relationship",
    prompt: "Would you rather treat a patient once and hand over, or follow them through their whole illness?",
    options: [
      {
        id: "follow",
        label: "Follow them through — I want to see the outcome",
        short: "wants to follow the whole journey",
        effects: {
          longitudinal_patient_relationship: e(1, 0.85),
          chronic_care: e(1, 0.5),
        },
      },
      {
        id: "episodic",
        label: "Episodic is fine — one problem, one resolution",
        short: "fine with episodic care",
        effects: {
          longitudinal_patient_relationship: e(-1, 0.7),
          acute_care: e(1, 0.3),
        },
      },
    ],
  },

  // ── Level 4: Clinical domain ────────────────────────────────────────────
  {
    id: "q-age-group",
    level: 4,
    category: "Clinical domain",
    prompt: "Which patient group do you most want to work with?",
    options: [
      {
        id: "children",
        label: "Children",
        short: "wants to treat children",
        effects: {
          pediatric_exposure: e(1, 1),
          adult_exposure: e(-1, 0.4),
        },
      },
      {
        id: "adults",
        label: "Adults",
        short: "wants to treat adults",
        effects: {
          adult_exposure: e(1, 1),
          pediatric_exposure: e(-1, 0.7),
        },
      },
      {
        id: "all",
        label: "All age groups — I don't want to narrow down",
        short: "all age groups",
        effects: {
          pediatric_exposure: e(1, 0.4),
          adult_exposure: e(1, 0.4),
        },
      },
    ],
  },
  {
    id: "q-womens-health",
    level: 4,
    category: "Clinical domain",
    prompt: "How important is working in women's health and reproductive medicine?",
    options: [
      {
        id: "central",
        label: "A central interest for me",
        short: "wants women's health",
        effects: {
          women_health_exposure: e(1, 1),
        },
      },
      {
        id: "open",
        label: "Open to it, not a driver",
        short: "open to women's health",
        effects: {
          women_health_exposure: e(1, 0.35),
        },
      },
      {
        id: "prefer-not",
        label: "I'd prefer to avoid it",
        short: "avoids women's health focus",
        effects: {
          women_health_exposure: e(-1, 0.9),
        },
      },
    ],
  },
  {
    id: "q-mental-health",
    level: 4,
    category: "Clinical domain",
    prompt: "How do you feel about mental health being a meaningful part of your practice?",
    options: [
      {
        id: "strong",
        label: "Strong interest — it's part of why I want to doctor",
        short: "strong mental health interest",
        effects: {
          mental_health_exposure: e(1, 1),
          chronic_care: e(1, 0.4),
          communication_intensity: e(1, 0.4),
        },
      },
      {
        id: "some",
        label: "Some exposure is fine",
        short: "open to mental health",
        effects: {
          mental_health_exposure: e(1, 0.35),
        },
      },
      {
        id: "prefer-not",
        label: "I'd rather it not be a major part of my work",
        short: "prefers minimal mental health focus",
        effects: {
          mental_health_exposure: e(-1, 0.85),
        },
      },
    ],
  },
  {
    id: "q-critical-care",
    level: 4,
    category: "Clinical domain",
    prompt: "How do you feel about ICUs and critically ill patients?",
    options: [
      {
        id: "want",
        label: "I want it — critical care is a core interest",
        short: "wants critical care",
        effects: {
          critical_care: e(1, 1),
          acute_care: e(1, 0.6),
          emergency_burden: e(1, 0.5),
        },
      },
      {
        id: "tolerable",
        label: "Tolerable in doses",
        short: "tolerates critical care",
        effects: {
          critical_care: e(1, 0.35),
        },
      },
      {
        id: "avoid",
        label: "I'd prefer to avoid ICU-type environments",
        short: "avoids critical care",
        effects: {
          critical_care: e(-1, 1),
          emergency_burden: e(-1, 0.4),
          night_duty: e(-1, 0.4),
        },
      },
    ],
  },
  {
    id: "q-diagnostic-world",
    level: 4,
    category: "Clinical domain",
    prompt: "Which diagnostic world appeals to you more?",
    options: [
      {
        id: "imaging",
        label: "Imaging — ultrasound, CT, MRI, nuclear scans",
        short: "drawn to imaging",
        effects: {
          imaging_orientation: e(1, 1),
          diagnostic_reasoning: e(1, 0.5),
          patient_interaction: e(-1, 0.3),
        },
      },
      {
        id: "laboratory",
        label: "Laboratory medicine — tissue, blood, cultures, assays",
        short: "drawn to laboratory medicine",
        effects: {
          laboratory_orientation: e(1, 1),
          patient_interaction: e(-1, 0.3),
        },
      },
      {
        id: "neither",
        label: "Neither especially — I'd rather stay at the bedside",
        short: "prefers bedside over diagnostics",
        effects: {
          imaging_orientation: e(-1, 0.6),
          laboratory_orientation: e(-1, 0.6),
          patient_interaction: e(1, 0.5),
        },
      },
    ],
  },
  {
    id: "q-population",
    level: 4,
    category: "Clinical domain",
    prompt: "How do you feel about population-level health, fieldwork and public health programmes?",
    options: [
      {
        id: "prefer",
        label: "I'd enjoy working at population level",
        short: "wants population health work",
        effects: {
          population_health: e(1, 1),
          patient_interaction: e(-1, 0.3),
        },
      },
      {
        id: "individual",
        label: "I want to work with individual patients, not statistics",
        short: "prefers individual patient care",
        effects: {
          population_health: e(-1, 0.75),
          patient_interaction: e(1, 0.5),
        },
      },
      {
        id: "open",
        label: "Open to either",
        short: "open to population health",
        effects: {
          population_health: e(1, 0.3),
        },
      },
    ],
  },

  // ── Level 5: Procedures ─────────────────────────────────────────────────
  {
    id: "q-operate",
    level: 5,
    category: "Procedures & surgery",
    prompt: "Do you want to operate?",
    options: [
      {
        id: "yes",
        label: "Yes — the operating theatre is central to what I want",
        short: "wants to operate",
        effects: {
          surgical_intensity: e(1, 1),
          procedural_intensity: e(1, 0.9),
          hands_on_work: e(1, 0.7),
        },
      },
      {
        id: "procedures-no-surgery",
        label: "Procedures yes, major surgery no",
        short: "wants procedures, not major surgery",
        effects: {
          procedural_intensity: e(1, 0.8),
          hands_on_work: e(1, 0.5),
          surgical_intensity: e(-1, 0.85),
        },
      },
      {
        id: "no-operative",
        label: "I absolutely do not want operative or technical procedural work",
        short: "does not want operative work",
        effects: {
          surgical_intensity: e(-1, 1),
          procedural_intensity: e(-1, 0.8),
          hands_on_work: e(-1, 0.5),
        },
        hardFilters: [
          { attribute: "surgical_intensity", max: 1 },
          { attribute: "procedural_intensity", max: 3 },
        ],
      },
    ],
  },
  {
    id: "q-theatre-time",
    level: 5,
    category: "Procedures & surgery",
    prompt: "How do you feel about long hours standing in the operating theatre or procedure suite?",
    options: [
      {
        id: "love",
        label: "That's my ideal day",
        short: "loves long theatre hours",
        effects: {
          surgical_intensity: e(1, 0.75),
          procedural_intensity: e(1, 0.5),
        },
      },
      {
        id: "focused",
        label: "Fine in focused sessions, not all day, every day",
        short: "prefers focused procedure sessions",
        effects: {
          procedural_intensity: e(1, 0.4),
        },
      },
      {
        id: "not-for-me",
        label: "Not for me",
        short: "avoids long theatre hours",
        effects: {
          surgical_intensity: e(-1, 0.85),
          hands_on_work: e(-1, 0.35),
        },
      },
    ],
  },
  {
    id: "q-tech-console",
    level: 5,
    category: "Procedures & surgery",
    prompt: "How much do you want to work with advanced technology — scanners, consoles, robotic systems, machines?",
    options: [
      {
        id: "strong",
        label: "Strong pull — technology is part of the appeal",
        short: "drawn to advanced technology",
        effects: {
          imaging_orientation: e(1, 0.8),
          hands_on_work: e(1, 0.4),
          patient_interaction: e(-1, 0.3),
        },
      },
      {
        id: "moderate",
        label: "Moderate — it's a tool, not the point",
        short: "technology as tool",
        effects: {
          imaging_orientation: e(1, 0.3),
        },
      },
      {
        id: "people",
        label: "I'd rather work with people than machines",
        short: "prefers people over machines",
        effects: {
          imaging_orientation: e(-1, 0.7),
          laboratory_orientation: e(-1, 0.4),
          patient_interaction: e(1, 0.6),
          communication_intensity: e(1, 0.3),
        },
      },
    ],
  },

  // ── Level 6: Deep differentiators ───────────────────────────────────────
  {
    id: "q-research",
    level: 6,
    category: "Differentiation",
    prompt: "How important is research, academics and teaching in your long-term career?",
    options: [
      {
        id: "central",
        label: "Central — I want to publish and teach",
        short: "wants research and teaching",
        effects: {
          research_orientation: e(1, 1),
        },
      },
      {
        id: "some",
        label: "Some is fine, but clinical work comes first",
        short: "some research is fine",
        effects: {
          research_orientation: e(1, 0.45),
        },
      },
      {
        id: "not",
        label: "Not important to me",
        short: "not interested in research",
        effects: {
          research_orientation: e(-1, 0.65),
        },
      },
    ],
  },
  {
    id: "q-practice-model",
    level: 6,
    category: "Differentiation",
    prompt: "What kind of career do you eventually want to build?",
    options: [
      {
        id: "private",
        label: "An independent private practice or clinic of my own",
        short: "wants independent private practice",
        effects: {
          private_practice_potential: e(1, 1),
          entrepreneurial_potential: e(1, 0.9),
        },
      },
      {
        id: "hospital",
        label: "A senior hospital or institutional clinical role",
        short: "prefers institutional clinical role",
        effects: {
          private_practice_potential: e(1, 0.3),
          duty_predictability: e(1, 0.2),
        },
      },
      {
        id: "academic",
        label: "Academia, government or research institutions",
        short: "prefers academia and research roles",
        effects: {
          research_orientation: e(1, 0.7),
          private_practice_potential: e(-1, 0.35),
        },
      },
    ],
  },
  {
    id: "q-subspecialty",
    level: 6,
    category: "Differentiation",
    prompt: "How much do you want a clear ladder of subspecialisation after your PG?",
    options: [
      {
        id: "important",
        label: "Very important — I want a defined path to sub-expertise",
        short: "wants clear subspecialty ladder",
        effects: {
          scope_for_subspecialization: e(1, 1),
        },
      },
      {
        id: "nice",
        label: "Nice to have",
        short: "open to subspecialty paths",
        effects: {
          scope_for_subspecialization: e(1, 0.45),
        },
      },
      {
        id: "generalist",
        label: "I'd rather stay a broad generalist",
        short: "prefers generalist breadth",
        effects: {
          scope_for_subspecialization: e(-1, 0.75),
        },
      },
    ],
  },
  {
    id: "q-earnings-model",
    level: 6,
    category: "Differentiation",
    prompt: "How do you feel about your long-term income being tied to building your own brand and business?",
    options: [
      {
        id: "excited",
        label: "Excited by it — I want to build something",
        short: "excited by building a practice",
        effects: {
          entrepreneurial_potential: e(1, 1),
          private_practice_potential: e(1, 0.7),
        },
      },
      {
        id: "fine",
        label: "Fine either way",
        short: "neutral on entrepreneurship",
        effects: {
          entrepreneurial_potential: e(1, 0.3),
        },
      },
      {
        id: "stability",
        label: "I'd prefer stable institutional income over business risk",
        short: "prefers stable institutional income",
        effects: {
          entrepreneurial_potential: e(-1, 0.8),
          private_practice_potential: e(-1, 0.4),
        },
      },
    ],
  },
];

export const questionsById = new Map(QUESTIONS.map((q) => [q.id, q]));
export const UNSURE_OPTION_ID = "unsure";
export const MIN_QUESTIONS_TO_FINISH = 8;
export const MAX_QUESTIONS = 20;
