export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** 0–5 display value → normalized 0..1 */
export const norm = (value: number): number => value / 5;

export const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

export const stddev = (xs: number[]): number => {
  if (xs.length <= 1) return 0;
  const m = avg(xs);
  return Math.sqrt(avg(xs.map((x) => (x - m) ** 2)));
};

export const bandColor = (band: "strong" | "moderate" | "eliminated"): string => {
  if (band === "strong") return "text-fit-strong";
  if (band === "moderate") return "text-fit-moderate";
  return "text-fit-low";
};
