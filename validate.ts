import { ATTRIBUTE_ORDER } from "./src/data/attributes.ts";
import { SPECIALTIES } from "./src/data/specialties.ts";
import { QUESTIONS } from "./src/data/questions.ts";
import { computePool } from "./src/engine/compatibilityEngine.ts";
import { selectNextQuestion } from "./src/engine/questionSelector.ts";

let errors = 0;
const fail = (m: string) => {
  errors++;
  console.error("FAIL:", m);
};

// 1. Attribute arrays are correct length
for (const s of SPECIALTIES) {
  if (s.a.length !== ATTRIBUTE_ORDER.length)
    fail(`${s.name}: attr array ${s.a.length} != ${ATTRIBUTE_ORDER.length}`);
  for (const v of s.a) if (!Number.isInteger(v) || v < 0 || v > 5) fail(`${s.name}: value ${v}`);
}

// 2. Effect keys all valid attributes; dir ∈ {-1,0,1}; strength in (0,1]
const attrSet = new Set(ATTRIBUTE_ORDER);
for (const q of QUESTIONS) {
  if (!q.options.length) fail(`q ${q.id}: no options`);
  q.options.forEach((o) => {
    for (const [key, eff] of Object.entries(o.effects)) {
      if (!attrSet.has(key)) fail(`q ${q.id} opt ${o.id}: bad attr ${key}`);
      if (![-1, 0, 1].includes(eff.dir)) fail(`q ${q.id}: bad dir ${eff.dir}`);
      if (eff.strength <= 0 || eff.strength > 1) fail(`q ${q.id}: bad strength ${eff.strength}`);
    }
    o.hardFilters?.forEach((h) => {
      if (!attrSet.has(h.attribute)) fail(`q ${q.id}: bad hard attr ${h.attribute}`);
    });
  });
}

// 3. Engine end-to-end: walk a scripted answer set, verify exclusions happen
const answers: Record<string, string> = {
  "q-emergency": "avoid",
  "q-night-duty": "essential",
  "q-predictability": "very",
  "q-workload": "protected",
  "q-lifestyle-weight": "high",
  "q-day-environment": "images",
  "q-cognitive-hands": "thinking",
  "q-acute-chronic": "chronic",
  "q-diagnostic-draw": "core",
  "q-longitudinal": "very",
  "q-communication": "less",
  "q-continuity": "episodic",
  "q-age-group": "adults",
  "q-womens-health": "prefer-not",
  "q-mental-health": "prefer-not",
  "q-critical-care": "avoid",
  "q-diagnostic-world": "imaging",
  "q-population": "individual",
  "q-operate": "procedures-no-surgery",
  "q-theatre-time": "focused",
  "q-tech-console": "strong",
  "q-research": "some",
  "q-practice-model": "hospital",
  "q-subspecialty": "nice",
  "q-earnings-model": "fine",
};

const pool = computePool(answers);
console.log("=== ranked remaining (safe profile) ===");
pool.remaining.forEach((r) =>
  console.log(r.score.toFixed(2), r.band.padEnd(9), r.specialty.name, r.hardFiltered ? "[HARD]" : ""),
);
console.log("=== eliminated ===");
pool.eliminated.forEach((r) =>
  console.log(r.score.toFixed(2), r.specialty.name, r.conflicts[0]?.text ?? ""),
);
const radiology = pool.results.find((r) => r.specialty.id === "radiodiagnosis");
const surgery = pool.results.find((r) => r.specialty.id === "general-surgery");
const pathology = pool.results.find((r) => r.specialty.id === "pathology");
const anaes = pool.results.find((r) => r.specialty.id === "anaesthesiology");

if (!radiology) fail("radiology missing");
if (surgery && surgery.band === "strong") fail("surgery should not be strong given no-emergency+mild procedures profile");
if (surgery && !(surgery.conflicts.length > 0)) fail("surgery should carry generated conflict reasons");
if (pathology && pathology.band === "eliminated") fail("pathology should survive a diagnostic-leaning profile");
if (anaes && anaes.band === "strong") fail("anaes strong given 'avoid emergencies + essential no nights'");
if (pool.eliminated.length === 0) fail("expected some eliminated for an extreme profile");
const sorted = [...pool.remaining].sort((a, b) => b.score - a.score);
console.log("Top remaining:", sorted.slice(0, 5).map((r) => `${r.specialty.name}(${r.score.toFixed(2)},${r.band})`).join(" | "));
console.log("Remaining:", pool.remaining.length, "Eliminated:", pool.eliminated.length);

// 4. Hard filter check
const hf = computePool({ "q-operate": "no-operative" });
const hsurg = hf.results.find((r) => r.specialty.id === "general-surgery");
const hderm = hf.results.find((r) => r.specialty.id === "dermatology");
if (hsurg && !hsurg.hardFiltered) fail("surgery should be hard filtered by no-operative");
if (!hderm || (hderm.band === "eliminated" && !hderm.hardFiltered)) fail("derm elimination check");
console.log("Hard filter: surgery =", hsurg?.hardFiltered, "derm band =", hderm?.band);

// 5. Question selector determinism + flow
let sel = { answers: {}, skipped: [], asked: [], cursor: 0 };
const p0 = computePool(sel.answers);
const first = selectNextQuestion(sel as never, p0.remaining.map((r) => r.specialty));
if (!first.questionId) fail("should pick a question");
sel = { answers: { [first.questionId]: "thrive" }, skipped: [], asked: [first.questionId], cursor: 1 };
const p1 = computePool(sel.answers);
const second = selectNextQuestion(sel as never, p1.remaining.map((r) => r.specialty));
console.log("Adaptive order q1:", first.questionId, "-> q2:", second.questionId);
if (second.questionId === first.questionId) fail("selector repeated a question");

// 6. Try "surgical lover" — surgery should top the pool
const surgAnswers = {
  "q-emergency": "thrive",
  "q-night-duty": "not-priority",
  "q-predictability": "variety",
  "q-workload": "heavy",
  "q-cognitive-hands": "hands",
  "q-acute-chronic": "acute",
  "q-diagnostic-draw": "action",
  "q-operate": "yes",
  "q-theatre-time": "love",
};
const sp = computePool(surgAnswers);
const top = sp.remaining[0];
console.log("Surgical-lover top:", top?.specialty.name, top?.score.toFixed(2));
if (top && top.specialty.id !== "general-surgery" && top.score < 0.75) fail("surgery should dominate for operative lover");

console.log(errors === 0 ? "ALL CHECKS PASSED" : `${errors} CHECKS FAILED`);

// 7. Gradual narrowing: a couple of moderate answers shouldn't hard-cut yet
const gentle = computePool({ "q-emergency": "tolerate", "q-night-duty": "important" });
const gSurg = gentle.results.find((r) => r.specialty.id === "general-surgery");
const gES = gentle.results.find((r) => r.specialty.id === "emergency-medicine");
if (gSurg && gSurg.band === "eliminated") fail("gentle profile should not eliminate surgery early");
if (gES && gES.band === "eliminated") fail("gentle profile should not eliminate EM early");
if (gentle.answeredCount !== 2) fail("answeredCount mismatch");

// 8. Strong two-question contradiction drives deprioritisation (not instant delete)
const sharp = computePool({ "q-emergency": "avoid", "q-night-duty": "essential" });
const sSurg = sharp.results.find((r) => r.specialty.id === "general-surgery");
const sNuclear = sharp.results.find((r) => r.specialty.id === "nuclear-medicine");
if (sSurg && sSurg.band === "strong") fail("two strong contradictions should demote surgery");
if (sNuclear && sNuclear.band !== "strong") fail("nuclear med should lead for night-averse user");
console.log(
  `Gentle(2 ans): surgery=${gSurg?.band} emed=${gES?.band} score(surg)=${gSurg?.score.toFixed(2)} | Sharp(2 ans): surgery=${sSurg?.band} nuclear=${sNuclear?.band}`,
);

// 9. Profile builder sanity
import { buildUserProfile } from "./src/engine/profile.ts";
const profile = buildUserProfile(answers);
const nightPref = profile["night_duty"];
if (nightPref === undefined || nightPref > 1.5) fail("night_duty profile should be very low for night-averse user");
console.log("Profile night_duty pref =", nightPref, "| lazypredict =", profile["lifestyle_predictability"]);

// 10. "I'm unsure" only → pool must stay broad (nothing eliminated)
const unsurePool = computePool({ "q-emergency": "unsure", "q-night-duty": "unsure", "q-operate": "unsure" });
if (unsurePool.eliminated.length > 0) fail("unsure answers must not eliminate anything");
console.log(`Unsure-only: remaining=${unsurePool.remaining.length} eliminated=${unsurePool.eliminated.length} (must stay broad)`);

process.exit(errors === 0 ? 0 : 1);