import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { SPECIALTIES } from "../data/specialties";
import type { SpecialtyCategory } from "../data/types";
import { cn } from "../utils/cn";

const CATEGORIES: Array<{ id: SpecialtyCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "clinical", label: "Clinical" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "para-clinical", label: "Para-clinical" },
  { id: "public-health", label: "Public health" },
];

const CATEGORY_COLOR: Record<SpecialtyCategory, string> = {
  clinical: "bg-accent-50 text-accent-700 border-accent-100",
  diagnostic: "bg-brand-50 text-brand-700 border-brand-100",
  "para-clinical": "bg-surface-100 text-ink-500 border-surface-200",
  "public-health": "bg-fit-strong-bg text-fit-strong border-fit-strong/20",
};

export function Specialties() {
  const [category, setCategory] = useState<SpecialtyCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPECIALTIES.filter((s) => {
      const inCat = category === "all" || s.category === category;
      const inQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.pathways.some((p) => p.toLowerCase().includes(q));
      return inCat && inQuery;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10">
      <header className="max-w-3xl">
        <span className="mono-label text-accent-700">Reference</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Explore all specialties
        </h1>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
          Every modelled Indian PG branch, with structured attributes, typical work, pathways
          and trade-offs. Profile pages reflect current counselling realities separately from
          the fit model.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category filter">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                category === c.id
                  ? "border-brand-700 bg-brand-900 text-white"
                  : "border-surface-300 bg-white text-ink-500 hover:border-brand-300 hover:text-brand-800",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="relative block w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search branches, pathways…"
            className="w-full rounded-lg border border-surface-300 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-400"
          />
        </label>
      </div>

      <p className="mt-4 mono-label text-ink-300">
        {filtered.length} of {SPECIALTIES.length} branches
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-surface-300 bg-white p-10 text-center">
          <p className="text-sm text-ink-500">No branches match that filter.</p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
            }}
            className="mt-3 text-[13px] font-semibold text-brand-700 hover:text-brand-900"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to={`/specialty/${s.id}`}
              className="group rounded-xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-[0_8px_24px_-12px_rgba(13,24,38,0.14)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                    CATEGORY_COLOR[s.category],
                  )}
                >
                  {s.category === "clinical"
                    ? "Clinical"
                    : s.category === "diagnostic"
                      ? "Diagnostic"
                      : s.category === "public-health"
                        ? "Public health"
                        : "Para-clinical"}
                </span>
                <span className="mono-label text-ink-300">{s.degree}</span>
              </div>
              <h3 className="mt-3 text-[16px] font-semibold tracking-tight text-ink-900 group-hover:text-brand-800">
                {s.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
                {s.tagline}
              </p>
              <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-ink-400">
                {s.pathways.slice(0, 3).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-8 max-w-2xl text-[12px] leading-relaxed text-ink-400">
        Branch availability varies by counselling pathway (NEET-PG, state, INI-CET) and is not
        evaluated here — treat this catalogue as a decision-support reference, not the current
        seat matrix.
      </p>
    </div>
  );
}