export const ATTRIBUTE_ORDER = [
  "emergency_burden",
  "night_duty",
  "duty_predictability",
  "acute_care",
  "chronic_care",
  "patient_interaction",
  "longitudinal_patient_relationship",
  "communication_intensity",
  "diagnostic_reasoning",
  "procedural_intensity",
  "surgical_intensity",
  "OPD_intensity",
  "IPD_intensity",
  "laboratory_orientation",
  "imaging_orientation",
  "hands_on_work",
  "cognitive_work",
  "critical_care",
  "pediatric_exposure",
  "adult_exposure",
  "women_health_exposure",
  "mental_health_exposure",
  "population_health",
  "research_orientation",
  "lifestyle_predictability",
  "private_practice_potential",
  "entrepreneurial_potential",
  "scope_for_subspecialization",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_ORDER)[number];

export interface AttributeMeta {
  key: AttributeKey;
  label: string;
  /** Phrase describing the high end of this attribute, used in generated explanations. */
  high: string;
  /** Phrase describing the low end of this attribute, used in generated explanations. */
  low: string;
  /** Short label for dense UI (compare rows, pool tooltips). */
  short: string;
}

const meta = (key: AttributeKey, label: string, short: string, high: string, low: string): AttributeMeta => ({
  key,
  label,
  short,
  high,
  low,
});

export const ATTRIBUTE_META: Record<AttributeKey, AttributeMeta> = {
  emergency_burden: meta("emergency_burden", "Emergency burden", "Emergency", "a high load of emergency and unscheduled work", "little unscheduled emergency work"),
  night_duty: meta("night_duty", "Night duty", "Night duty", "frequent night duties and long on-calls", "rarely any night duty"),
  duty_predictability: meta("duty_predictability", "Duty predictability", "Predictability", "largely predictable duty schedules", "unpredictable, shift-driven schedules"),
  acute_care: meta("acute_care", "Acute care", "Acute care", "a strong acute and time-sensitive caseload", "mostly non-acute, elective workloads"),
  chronic_care: meta("chronic_care", "Chronic & long-term care", "Chronic care", "substantial long-term condition management", "limited longitudinal disease management"),
  patient_interaction: meta("patient_interaction", "Patient interaction", "Patient contact", "frequent face-to-face patient contact", "comparatively limited direct patient contact"),
  longitudinal_patient_relationship: meta("longitudinal_patient_relationship", "Long-term patient relationships", "Continuity", "following the same patients over time", "largely episodic, one-off patient encounters"),
  communication_intensity: meta("communication_intensity", "Communication & counselling", "Communication", "heavy counselling and difficult conversations", "less time spent on extended patient communication"),
  diagnostic_reasoning: meta("diagnostic_reasoning", "Diagnostic reasoning", "Diagnostics", "deep diagnostic and interpretive reasoning", "protocols and execution more than open-ended diagnosis"),
  procedural_intensity: meta("procedural_intensity", "Procedural intensity", "Procedures", "procedures as a routine part of the day", "a largely non-procedural daily routine"),
  surgical_intensity: meta("surgical_intensity", "Surgical intensity", "Surgery", "regular time in the operating theatre", "essentially no operating-theatre work"),
  OPD_intensity: meta("OPD_intensity", "OPD / clinic workload", "OPD", "a heavy outpatient clinic workload", "limited outpatient clinic work"),
  IPD_intensity: meta("IPD_intensity", "IPD / ward & inpatient workload", "IPD", "substantial inpatient and ward responsibilities", "limited inpatient responsibilities"),
  laboratory_orientation: meta("laboratory_orientation", "Laboratory orientation", "Lab", "day-to-day work centered on laboratory systems", "little routine laboratory work"),
  imaging_orientation: meta("imaging_orientation", "Imaging & technology orientation", "Imaging", "close work with imaging and advanced machines", "limited routine imaging or console work"),
  hands_on_work: meta("hands_on_work", "Hands-on work", "Hands-on", "highly hands-on, technical work", "a mostly desk-, screen- or discussion-based workflow"),
  cognitive_work: meta("cognitive_work", "Cognitive workload", "Cognitive", "demanding cognitive and analytical work", "more pattern-based, protocol-driven work"),
  critical_care: meta("critical_care", "Critical care exposure", "Critical care", "regular involvement with critically ill patients", "rarely involved with critically ill patients"),
  pediatric_exposure: meta("pediatric_exposure", "Paediatric exposure", "Paediatrics", "regular care of children", "essentially no work with children"),
  adult_exposure: meta("adult_exposure", "Adult exposure", "Adults", "primarily adult patients", "little adult patient work"),
  women_health_exposure: meta("women_health_exposure", "Women's health exposure", "Women's health", "regular work in women's health and reproductive medicine", "little dedicated women's health work"),
  mental_health_exposure: meta("mental_health_exposure", "Mental health exposure", "Mental health", "meaningful mental health component in practice", "minimal mental health component"),
  population_health: meta("population_health", "Population & community health", "Population health", "fieldwork and population-level health work", "individual clinical care rather than population work"),
  research_orientation: meta("research_orientation", "Research & academics", "Research", "a strong research and teaching component", "limited expectation of research or teaching"),
  lifestyle_predictability: meta("lifestyle_predictability", "Lifestyle predictability", "Lifestyle", "a generally predictable lifestyle pattern", "a lifestyle shaped by irregular, demanding schedules"),
  private_practice_potential: meta("private_practice_potential", "Private practice potential", "Private practice", "strong scope for independent private practice", "mostly institution-dependent career paths"),
  entrepreneurial_potential: meta("entrepreneurial_potential", "Entrepreneurial potential", "Entrepreneurship", "clear room to build clinics, brands or businesses", "career paths that rarely involve building a business"),
  scope_for_subspecialization: meta("scope_for_subspecialization", "Scope for subspecialization", "Subspecialty", "a clear ladder of subspecialty fellowships", "relatively few formally distinct subspecialty paths"),
};

export const ATTRIBUTE_LABELS = ATTRIBUTE_ORDER.map((k) => ATTRIBUTE_META[k].label);

export const attrLabel = (key: AttributeKey): string => ATTRIBUTE_META[key].label;
