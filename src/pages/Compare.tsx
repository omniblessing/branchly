import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GitCompareArrows, Search, X } from "lucide-react";
import { SPECIALTIES, specialtyById } from "../data/specialties";
import { ATTRIBUTE_ORDER, type AttributeKey } from "../data/attributes";
import { getCompareSelection, setCompareSelection } from "../utils/compareSelection";
import { AttributeBar, type BarTone } from "../components/AttributeBar";
import { cn } from "../utils/cn";

const COMPARE_ROWS: Array<{ key: AttributeKey; label: string; why: string }> = [
  { key: "emergency_burden", label: "Emergency exposure", why: "Unscheduled, time-sensitive work and how much of the day it occupies." },
  { key: "night_duty", label: "Night duties", why: "Frequency of nights and long on-calls reported in most training structures." },
  { key: "duty_predictability", label: "Duty predictability", why: "How schedulable the daily/weekly routine tends to be." },
  { key: "patient_interaction", label: "Patient interaction", why: "Pace and volume of face-to-face patient contact." },
  { key: "longitudinal_patient_relationship", label: "Long-term relationships", why: "Whether patients are followed over months or years." },
  { key: "communication_intensity", label: "Communication & counselling", why: "How much of the job is persuasion, counselling and difficult conversations." },
  { key: "diagnostic_reasoning", label: "Diagnostic reasoning", why: "Depth of open-ended diagnostic and interpretive work." },
  { key: "procedural_intensity", label: "Procedures", why: "How central hands-on procedures are to the daily routine." },
  { key: "surgical_intensity", label: "Operating-theatre work", why: "Time spent inside surgery or equivalent operative environments." },
  { key: "OPD_intensity", label: "OPD workload", why: "Outpatient clinic volume during residency." },
  { key: "IPD_intensity", label: "IPD / ward workload", why: "Inpatient, ward and admission responsibilities." },
  { key: "critical_care", label: "Critical care exposure", why: "Involvement with ICU and critically ill patients." },
  { key: "lifestyle_predictability", label: "Lifestyle predictability", why: "Overall predictability of lifestyle during and after training." },
  { key: "scope_for_subspecialization", label: "Future specialization", why: "Clarity and breadth of subspecialty ladders after PG." },
  { key: "private_practice_potential", label: "Practice model", why: "How much the branch favours independent private practice." },
];

const COLUMN_TONES: BarTone[] = ["brand", "accent", "strong", "moderate"];
const COLUMN_HEADS: string[] = [
  "text-brand-700 bg-brand-50 border-brand-100",
  "text-accent-700 bg-accent-50 border-accent-100",
  "text-fit-strong bg-fit-strong-bg border-fit-strong/20",
  "text-fit-moderate bg-fit-moderate-bg border-fit-moderate/25",
];

export function Compare() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(() => getCompareSelection());
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const chosen = useMemo(
    () => selected.map((id) => specialtyById(id)).filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [selected],
  );

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPECIALTIES.filter(
      (s) => !selected.includes(s.id) && (!q || s.name.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [selected, query]);

  const select = (id: string) => {
    const next = setCompareSelection([...selected, id]);
    setSelected(next);
    setQuery("");
  };

  const remove = (id: string) => {
    const next = setCompareSelection(selected.filter((x) => x !== id));
    setSelected(next);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10">
      <header className="max-w-3xl">
        <span className="mono-label text-accent-700">Side by side</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Compare branches
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
          Select 2–4 specialties and view their structured work profiles side by side. Bars
          are structured estimates, not precise scores.
        </p>
      </header>

      {/* Selection bar */}
      <div className="mt-7 rounded-xl border border-surface-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          {chosen.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold",
                COLUMN_HEADS[i],
              )}
            >
              {s.name}
              {selected.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  aria-label={`Remove ${s.name}`}
                  className="rounded p-0.5 opacity-70 hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}

          {selected.length < 4 && (
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-surface-300 px-3 py-2 text-[13px] font-medium text-ink-400 hover:border-brand-300 hover:text-brand-700"
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
              {selected.length === 0 ? "Add branches to compare" : "Add branch"}
            </button>
          )}
        </div>

        {pickerOpen && (
          <div className="mt-3 border-t border-surface-100 pt-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && candidates[0]) {
                    select(candidates[0].id);
                    setPickerOpen(false);
                  }
                }}
                placeholder="Search a branch…"
                className="w-full rounded-lg border border-surface-300 py-2 pl-9 pr-3 text-sm focus:border-brand-400"
              />
            </label>
            <ul className="mt-2 grid gap-1">
              {candidates.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      select(c.id);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                  >
                    <span className="mono-label mr-2 text-ink-300">{c.degree}</span>
                    {c.name}
                  </button>
                </li>
              ))}
              {candidates.length === 0 && (
                <li className="px-3 py-2 text-[12.5px] text-ink-400">No branches match.</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {chosen.length < 2 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-surface-300 bg-white px-6 py-16 text-center">
          <GitCompareArrows className="h-10 w-10 text-brand-300" />
          <p className="mt-4 text-sm font-medium text-ink-700">
            Select at least two branches to compare
          </p>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-400">
            Add branches above, or pull them in from your discovery results.
          </p>
          <Link to="/results" className="mt-4 text-[13px] font-semibold text-brand-700 hover:text-brand-900">
            Go to my results →
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-200 bg-white">
          <div
            className="min-w-[720px]"
            style={{
              display: "grid",
              gridTemplateColumns: `minmax(200px, 1.1fr) repeat(${chosen.length}, minmax(170px, 1fr))`,
            }}
          >
            {/* Headers */}
            <div className="border-b border-surface-200 bg-surface-50 px-4 py-3">
              <span className="mono-label text-ink-400">Attribute</span>
            </div>
            {chosen.map((s, i) => (
              <div
                key={s.id}
                className={cn("border-b border-l border-surface-200 px-4 py-3", COLUMN_HEADS[i])}
              >
                <span className="mono-label">{s.degree}</span>
                <p className="mt-0.5 truncate text-[13.5px] font-semibold">{s.name}</p>
              </div>
            ))}

            {/* Rows */}
            {COMPARE_ROWS.map((row, rowIndex) => (
              <div key={row.key} className="contents">
                <div
                  className={cn(
                    "flex items-start gap-2 px-4 py-3.5",
                    rowIndex % 2 === 0 && "bg-surface-50/60",
                  )}
                >
                  <span
                    className="text-[12.5px] font-medium leading-snug text-ink-700"
                    title={row.why}
                  >
                    {row.label}
                  </span>
                </div>
                {chosen.map((s, i) => {
                  const value = s.a[ATTRIBUTE_ORDER.indexOf(row.key)];
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "border-l px-4 py-3.5",
                        rowIndex % 2 === 0 && "bg-surface-50/60",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <AttributeBar
                          value={value}
                          tone={COLUMN_TONES[i]}
                          className="h-2 flex-1"
                        />
                        <span className="w-6 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-400">
                          {value}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Footer actions */}
            <div className="border-t border-surface-200 bg-surface-50 px-4 py-3" />
            {chosen.map((s) => (
              <div
                key={s.id}
                className="border-l border-t border-surface-200 bg-surface-50 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/specialty/${s.id}`)}
                  className="text-[12.5px] font-semibold text-brand-700 hover:text-brand-900"
                >
                  View profile →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 max-w-2xl text-[12px] leading-relaxed text-ink-400">
        Comparison bars are structured estimates informed by curricula and recurring resident
        experience. They vary substantially between institutions and are decision support,
        not official data.
      </p>
    </div>
  );
}