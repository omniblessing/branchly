import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Check,
  GitCompareArrows,
  Lightbulb,
  MessagesSquare,
  Route,
  Timer,
  TriangleAlert,
  Workflow,
} from "lucide-react";
import { specialtyById } from "../data/specialties";
import { ATTRIBUTE_ORDER, type AttributeKey } from "../data/attributes";
import { EvidencePanel } from "../components/EvidencePanel";
import { AttributeRow } from "../components/AttributeBar";
import { useDiscovery } from "../store/useDiscovery";
import { cn } from "../utils/cn";

const KEY_ATTRIBUTES: AttributeKey[] = [
  "emergency_burden",
  "night_duty",
  "duty_predictability",
  "patient_interaction",
  "longitudinal_patient_relationship",
  "communication_intensity",
  "diagnostic_reasoning",
  "procedural_intensity",
  "surgical_intensity",
  "OPD_intensity",
  "IPD_intensity",
  "critical_care",
  "laboratory_orientation",
  "imaging_orientation",
  "lifestyle_predictability",
  "scope_for_subspecialization",
];

const attributeValue = (specialtyId: string, key: string): number => {
  const s = specialtyById(specialtyId);
  if (!s) return 0;
  return s.a[ATTRIBUTE_ORDER.indexOf(key as AttributeKey)];
};

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="text-brand-600">{icon}</span>
        <h2 className="text-sm font-semibold tracking-tight text-ink-900">{title}</h2>
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

const bullet = (icon: React.ReactNode, color: string) => (text: string) => (
  <li className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-600">
    <span className={cn("mt-0.5 shrink-0", color)}>{icon}</span>
    <span>{text}</span>
  </li>
);

export function SpecialtyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const specialty = id ? specialtyById(id) : undefined;
  const { pool } = useDiscovery();
  const [inCompare, setInCompare] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem("pgbc-compare-v1") ?? "[]") as string[]).includes(
        id ?? "",
      );
    } catch {
      return false;
    }
  });

  const result = useMemo(
    () => pool.results.find((r) => r.specialty.id === id),
    [pool, id],
  );

  if (!specialty) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-ink-900">Branch not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          This specialty isn't in the modelled dataset (yet).
        </p>
        <Link to="/specialties" className="mt-5 text-sm font-semibold text-brand-700">
          ← Back to all specialties
        </Link>
      </div>
    );
  }

  const toggleCompare = () => {
    const current: string[] = JSON.parse(
      localStorage.getItem("pgbc-compare-v1") ?? "[]",
    );
    const next = current.includes(specialty.id)
      ? current.filter((x) => x !== specialty.id)
      : [...current, specialty.id].slice(0, 4);
    localStorage.setItem("pgbc-compare-v1", JSON.stringify(next));
    setInCompare(next.includes(specialty.id));
  };

  const check = bullet(
    <Check className="h-4 w-4" />,
    "text-fit-strong",
  );
  const warn = bullet(
    <TriangleAlert className="h-4 w-4" />,
    "text-fit-moderate",
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="mono-label rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-brand-700">
              {specialty.degree}
            </span>
            <span className="mono-label rounded-full border border-surface-200 bg-surface-100 px-2 py-0.5 text-ink-500">
              {specialty.category === "clinical"
                ? "Clinical"
                : specialty.category === "diagnostic"
                  ? "Diagnostic"
                  : specialty.category === "public-health"
                    ? "Public health"
                    : "Para-clinical"}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {specialty.name}
          </h1>
          <p className="mt-1.5 text-[15.5px] text-ink-500">{specialty.tagline}</p>
        </div>
        <button
          type="button"
          onClick={toggleCompare}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors",
            inCompare
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-surface-300 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-800",
          )}
        >
          <GitCompareArrows className="h-4 w-4" />
          {inCompare ? "In compare" : "Add to compare"}
        </button>
      </header>

      <p className="mt-4 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
        {specialty.overview}
      </p>

      {/* Attitude profile */}
      <section className="mt-8 rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-brand-600" />
          <h2 className="text-sm font-semibold tracking-tight text-ink-900">
            Structured work profile
          </h2>
          <span className="mono-label ml-auto text-ink-300">0–5 scale</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-400">
          Structured estimates informed by curricula and recurring resident experience —
          see the evidence section below. Not an official measurement.
        </p>
        <div className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {KEY_ATTRIBUTES.map((key) => (
            <AttributeRow
              key={key}
              attributeKey={key}
              value={attributeValue(specialty.id, key)}
            />
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel icon={<Workflow className="h-4 w-4" />} title="Typical work">
            <ul className="space-y-2">{specialty.typicalWork.map((t) => check(t))}</ul>
          </Panel>

          <Panel icon={<Building2 className="h-4 w-4" />} title="Common work environments">
            <ul className="flex flex-wrap gap-2">
              {specialty.environments.map((env) => (
                <li
                  key={env}
                  className="rounded-md border border-surface-200 bg-surface-50 px-2.5 py-1.5 text-[12.5px] font-medium text-ink-600"
                >
                  {env}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={<Route className="h-4 w-4" />} title="Post-PG pathways">
            <ul className="space-y-2">
              {specialty.pathways.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2 text-[13.5px] text-ink-600"
                >
                  <Route className="h-3.5 w-3.5 shrink-0 text-accent-600" />
                  {p}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={<Lightbulb className="h-4 w-4" />} title="Subspecialization possibilities">
            <ul className="flex flex-wrap gap-2">
              {specialty.subspecialties.map((s2) => (
                <li
                  key={s2}
                  className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-700"
                >
                  {s2}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel icon={<Check className="h-4 w-4" />} title="Potential advantages">
            <ul className="space-y-2">{specialty.advantages.map((a) => check(a))}</ul>
          </Panel>

          <Panel icon={<TriangleAlert className="h-4 w-4" />} title="Potential trade-offs">
            <ul className="space-y-2">{specialty.tradeoffs.map((t) => warn(t))}</ul>
          </Panel>

          <Panel icon={<MessagesSquare className="h-4 w-4" />} title="Questions to ask residents">
            <ul className="space-y-2.5">
              {specialty.residentQuestions.map((q) => (
                <li
                  key={q}
                  className="flex gap-2.5 rounded-lg border border-surface-200 bg-surface-50 px-3.5 py-3 text-[13px] leading-relaxed text-ink-600"
                >
                  <span className="text-accent-600">Q</span>
                  {q}
                </li>
              ))}
            </ul>
          </Panel>

          {result && (result.fits.length > 0 || result.conflicts.length > 0) && (
            <Panel icon={<Timer className="h-4 w-4" />} title="Fit with your answers">
              <p className="text-[12.5px] leading-relaxed text-ink-400">
                Based on your discovery answers, this branch is currently:
                <span
                  className={cn(
                    "ml-1.5 font-semibold",
                    result.band === "strong" && "text-fit-strong",
                    result.band === "moderate" && "text-fit-moderate",
                    result.band === "eliminated" && "text-fit-low",
                  )}
                >
                  {result.band === "strong"
                    ? "high compatibility"
                    : result.band === "moderate"
                      ? "moderate compatibility"
                      : "deprioritised"}
                </span>
                .
              </p>
              {result.fits.length > 0 && (
                <ul className="mt-3 space-y-2">
                  <p className="mono-label text-fit-strong">Why it fits</p>
                  {result.fits.slice(0, 4).map((f) => (
                    <li
                      key={f.questionId + f.attribute}
                      className="flex gap-2 text-[13px] leading-relaxed text-ink-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-fit-strong" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              )}
              {result.conflicts.length > 0 && (
                <ul className="mt-3 space-y-2">
                  <p className="mono-label text-fit-moderate">Why it may not fit</p>
                  {result.conflicts.slice(0, 3).map((c) => (
                    <li
                      key={c.questionId + c.attribute}
                      className="flex gap-2 text-[13px] leading-relaxed text-ink-600"
                    >
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-fit-moderate" />
                      {c.text}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-6">
        <EvidencePanel specialtyId={specialty.id} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-surface-200 pt-6">
        <Link
          to="/results"
          className="rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Fit in my current results
        </Link>
        <Link
          to="/discover"
          className="rounded-md border border-surface-300 px-4 py-2 text-sm font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-800"
        >
          Refine discovery
        </Link>
        <Link
          to="/compare"
          className="rounded-md border border-surface-300 px-4 py-2 text-sm font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-800"
        >
          Open compare
        </Link>
      </div>
    </div>
  );
}