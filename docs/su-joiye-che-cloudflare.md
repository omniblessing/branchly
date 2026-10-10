# Su Joiye Che — Cloudflare Worker update

This connects the Branchly page to the existing Google Sheets-backed Worker. It deliberately returns **only rank and preferred branch**—never candidate IDs, names, phone numbers, marks, or timestamps.

## 1. Open the existing Worker

In Cloudflare Dashboard, open **Workers & Pages → su-joiye-che → Edit Code**. Keep the existing script and its Google OAuth / Sheets functions. Find the main request handler's route section and add the code below **before its final 404 / not-found response**. Do not replace the whole Worker.

## 2. Add this endpoint

The code expects the existing `HEADERS` constant and `readCandidateRows(env)` function. Those are part of the current Worker.

```js
if (url.pathname === "/api/rank-list") {
  const allowedOrigins = new Set([
    "https://branchly.thorfin662.workers.dev",
    "http://localhost:5173",
  ]);
  const origin = request.headers.get("Origin") || "";
  const baseHeaders = {
    ...HEADERS,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
  const respond = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: {
      ...baseHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...(allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    },
  });

  if (!allowedOrigins.has(origin)) return respond({ success: false, error: "Origin not allowed" }, 403);
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { ...baseHeaders, "Access-Control-Allow-Origin": origin },
    });
  }
  if (request.method !== "GET") return respond({ success: false, error: "GET required" }, 405);

  const rawRank = url.searchParams.get("rank") || "";
  const rank = Number(rawRank);
  const requested = (url.searchParams.get("branches") || "")
    .split("|").map(value => value.trim()).filter(Boolean);

  if (!/^\d+$/.test(rawRank) || !Number.isSafeInteger(rank) || rank < 1 ||
      requested.length < 1 || requested.length > 16 ||
      requested.some(branch => branch.length > 100)) {
    return respond({ success: false, error: "Invalid rank or branch selection" }, 400);
  }

  const normalizeBranch = value => String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[()]/g, " ")
    .replace(/\b(md|ms|dnb|diploma|degree|in)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  try {
    const candidates = await readCandidateRows(env);
    const ranked = candidates.map(candidate => ({
      rank: Number(String(candidate.rank ?? "").replace(/,/g, "").trim()),
      branch: String(candidate.preferredBranch || "").trim(),
    })).filter(item => Number.isSafeInteger(item.rank) && item.rank > 0 && item.branch);

    const knownBranches = [
      "General Medicine", "Radiodiagnosis", "Dermatology", "Paediatrics",
      "General Surgery", "Orthopaedics", "Psychiatry", "Anaesthesiology",
      "Obstetrics & Gynaecology", "Ophthalmology", "ENT", "Pathology",
      "Respiratory Medicine", "Emergency Medicine", "Radiation Oncology",
    ];
    const knownKeys = new Set(knownBranches.map(normalizeBranch));

    const branches = requested.map(branch => {
      const key = normalizeBranch(branch);
      const matches = ranked.filter(item => {
        const candidateKey = normalizeBranch(item.branch);
        if (key === "other") return !knownKeys.has(candidateKey);
        return candidateKey === key ||
          (key === "radiodiagnosis" && ["radio diagnosis", "radiology"].includes(candidateKey)) ||
          (key === "paediatrics" && ["pediatrics"].includes(candidateKey)) ||
          (key === "obstetrics gynaecology" && ["ob gyn", "obgyn", "obstetrics and gynaecology", "obstetrics gynecology"].includes(candidateKey)) ||
          (key === "ent" && ["otorhinolaryngology", "ear nose throat"].includes(candidateKey)) ||
          (key === "respiratory medicine" && ["pulmonary medicine", "respiratory"].includes(candidateKey));
      }).sort((a, b) => a.rank - b.rank);

      return {
        branch,
        total: matches.length,
        ahead: matches.filter(item => item.rank < rank).length,
        sameRank: matches.filter(item => item.rank === rank).length,
        behind: matches.filter(item => item.rank > rank).length,
        entries: matches.map(item => ({ rank: item.rank, branch: item.branch })),
      };
    });

    return respond({
      success: true,
      totalRanked: ranked.length,
      branches,
      disclaimer: "Voluntarily submitted preferences only; not official allotments or admission predictions.",
    });
  } catch (error) {
    console.error("Rank-list error:", error instanceof Error ? error.message : "Unknown error");
    return respond({ success: false, error: "Unable to retrieve rank-list data" }, 502);
  }
}
```

**Important:** if your live Branchly website has a different URL, replace `https://branchly.thorfin662.workers.dev` in `allowedOrigins` with that exact origin (scheme + hostname, no trailing slash). Keep localhost for local testing.

## 3. Deploy and smoke-test

Click **Deploy** in the Cloudflare editor. Cloudflare's dashboard supports editing a Worker and deploying the changed code. See [Cloudflare's dashboard guide](https://developers.cloudflare.com/workers/get-started/dashboard/).

Then open Branchly → **Su Joiye Che**, enter a test rank, choose one or two branches, and press **Analyse my options**. Confirm the page shows counts and rank rows. If it reports “Origin not allowed”, the live Branchly origin needs to be added to `allowedOrigins`. If a branch shows zero, check the exact wording in the Google Sheet's **Preferred Branch** column; no count should be interpreted as official counselling data.

## Privacy and interpretation

- This endpoint is public and exposes rank + branch only. Make sure the people who submitted the data were informed that anonymous rank/preference data would be displayed publicly.
- Do not include candidate IDs or any other identifying fields in the response.
- These are submitted preferences, not confirmed choices, seat allotments, or a prediction of admission.
