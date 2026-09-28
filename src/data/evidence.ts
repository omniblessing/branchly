import type { EvidenceItem } from "./types";

/**
 * Evidence layer (scaffold).
 *
 * Every specialty attribute can eventually carry evidence entries. Items here
 * are structured placeholders illustrating the model — recurring themes
 * condensed from resident discussions and education sources, never verbatim
 * quotes, and never presented as universal facts.
 */
export const EVIDENCE: EvidenceItem[] = [
  {
    specialtyId: "general-surgery",
    attribute: "night_duty",
    value: 5,
    source: "Recurring themes across Indian surgical residency discussions",
    sourceType: "reddit",
    date: "2025-11",
    summary:
      "Resident discussions commonly report frequent night and emergency duties during surgical residency; frequency varies substantially by institution and unit.",
    confidence: "moderate",
  },
  {
    specialtyId: "radiodiagnosis",
    attribute: "lifestyle_predictability",
    value: 4,
    source: "Resident experience summaries across teaching hospitals",
    sourceType: "resident-experience",
    date: "2026-01",
    summary:
      "Commonly reported as more schedule-predictable than acute-care-heavy branches, though emergency reporting and on-call duties remain common in hospital-based practice.",
    confidence: "moderate",
  },
  {
    specialtyId: "dermatology",
    attribute: "emergency_burden",
    value: 2,
    source: "Medical education & departmental curriculum review",
    sourceType: "medical-education",
    date: "2025-09",
    summary:
      "Curricula and departmental descriptions emphasise outpatient and procedural work; formal emergency components are generally limited — experiences vary by institution.",
    confidence: "moderate",
  },
  {
    specialtyId: "anaesthesiology",
    attribute: "critical_care",
    value: 5,
    source: "Institutional curriculum & residency structure",
    sourceType: "institutional",
    date: "2025-10",
    summary:
      "ICU responsibilities form a major, formally documented part of anaesthesiology training in Indian institutions.",
    confidence: "high",
  },
  {
    specialtyId: "pathology",
    attribute: "duty_predictability",
    value: 5,
    source: "Official postgraduate curriculum & regulations",
    sourceType: "official",
    date: "2025-08",
    summary:
      "Laboratory-based training structures generally follow working-hour patterns with limited night-duty requirements; local reporting loads can still be heavy.",
    confidence: "high",
  },
  {
    specialtyId: "obstetrics-gynaecology",
    attribute: "emergency_burden",
    value: 5,
    source: "Recurring themes in Indian OBGYN residency discussions",
    sourceType: "reddit",
    date: "2026-02",
    summary:
      "Labour-room and obstetric emergency cover are frequently described as unpredictable; patterns differ markedly between high-volume government and private institutions.",
    confidence: "moderate",
  },
  {
    specialtyId: "psychiatry",
    attribute: "communication_intensity",
    value: 5,
    source: "Resident experience & curriculum review",
    sourceType: "resident-experience",
    date: "2025-12",
    summary:
      "Long consultation times and family counselling are commonly reported as central to training; documentation burden is also frequently mentioned.",
    confidence: "moderate",
  },
  {
    specialtyId: "community-medicine",
    attribute: "population_health",
    value: 5,
    source: "Official curriculum for Preventive & Social Medicine",
    sourceType: "official",
    date: "2025-07",
    summary:
      "Field surveys, epidemiology and National Health Programme work are formally documented pillars of the specialty.",
    confidence: "high",
  },
  {
    specialtyId: "emergency-medicine",
    attribute: "duty_predictability",
    value: 1,
    source: "Resident discussions on shift structures",
    sourceType: "reddit",
    date: "2026-01",
    summary:
      "Shift-based rosters with nights and weekends are commonly reported as inherent; some centres offer more structured off-days than traditional on-call systems.",
    confidence: "moderate",
  },
  {
    specialtyId: "ophthalmology",
    attribute: "surgical_intensity",
    value: 4,
    source: "Medical education source & training literature",
    sourceType: "medical-education",
    date: "2025-10",
    summary:
      "Microsurgical training, especially cataract surgery, is a formally emphasised component; resident case volumes vary by programme.",
    confidence: "high",
  },
  {
    specialtyId: "radiodiagnosis",
    attribute: "patient_interaction",
    value: 2,
    source: "Recurring themes in radiology residency discussions",
    sourceType: "reddit",
    date: "2025-11",
    summary:
      "Residents commonly describe screen- and console-heavy days with less direct patient contact than clinical branches; ultrasound and interventional roles increase contact.",
    confidence: "moderate",
  },
  {
    specialtyId: "general-medicine",
    attribute: "scope_for_subspecialization",
    value: 5,
    source: "Official & institutional fellowship pathways",
    sourceType: "institutional",
    date: "2026-02",
    summary:
      "A wide set of DM pathways across organ systems is formally available after MD General Medicine.",
    confidence: "high",
  },
];

export const evidenceFor = (specialtyId: string): EvidenceItem[] =>
  EVIDENCE.filter((e) => e.specialtyId === specialtyId);

export const SOURCE_TYPE_LABEL: Record<EvidenceItem["sourceType"], string> = {
  "resident-experience": "Commonly reported resident experience",
  reddit: "Themes from community discussions — not universal facts",
  official: "Officially documented information",
  institutional: "Institutional source",
  "medical-education": "Medical education source",
  research: "Research / literature",
};
