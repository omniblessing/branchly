import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/brand";
const TEAL = "#14C8C2";
const NAVY = "#0F1B3D";

await mkdir(OUT, { recursive: true });

// Rasterisable source: navy rounded tile + teal branching icon (no text, so
// rendering never depends on a host font).
const tileSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="${NAVY}"/>
  <g transform="translate(256,256) scale(5.4) translate(-20,-20)">
    <g stroke="${TEAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M 17.172 17.172 C 20.3 13.4 24.2 11.8 28.132 11.868"/>
      <path d="M 22.828 17.172 C 26.6 20.3 28.2 24.2 28.132 28.132"/>
      <path d="M 22.828 22.828 C 19.7 26.6 15.8 28.2 11.868 28.132"/>
      <path d="M 17.172 22.828 C 13.4 19.7 11.8 15.8 11.868 11.868"/>
    </g>
    <g fill="${TEAL}">
      <circle cx="28.132" cy="11.868" r="2.8"/>
      <circle cx="28.132" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="11.868" r="2.8"/>
    </g>
  </g>
</svg>`;

// Maskable: icon scaled with safe-zone padding inside a full-bleed navy square.
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${NAVY}"/>
  <g transform="translate(256,256) scale(3.6) translate(-20,-20)">
    <g stroke="${TEAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M 17.172 17.172 C 20.3 13.4 24.2 11.8 28.132 11.868"/>
      <path d="M 22.828 17.172 C 26.6 20.3 28.2 24.2 28.132 28.132"/>
      <path d="M 22.828 22.828 C 19.7 26.6 15.8 28.2 11.868 28.132"/>
      <path d="M 17.172 22.828 C 13.4 19.7 11.8 15.8 11.868 11.868"/>
    </g>
    <g fill="${TEAL}">
      <circle cx="28.132" cy="11.868" r="2.8"/>
      <circle cx="28.132" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="11.868" r="2.8"/>
    </g>
  </g>
</svg>`;

// OG image 1200x630: navy canvas with the branching icon centred.
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <g transform="translate(600,315) scale(9) translate(-20,-20)">
    <g stroke="${TEAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M 17.172 17.172 C 20.3 13.4 24.2 11.8 28.132 11.868"/>
      <path d="M 22.828 17.172 C 26.6 20.3 28.2 24.2 28.132 28.132"/>
      <path d="M 22.828 22.828 C 19.7 26.6 15.8 28.2 11.868 28.132"/>
      <path d="M 17.172 22.828 C 13.4 19.7 11.8 15.8 11.868 11.868"/>
    </g>
    <g fill="${TEAL}">
      <circle cx="28.132" cy="11.868" r="2.8"/>
      <circle cx="28.132" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="28.132" r="2.8"/>
      <circle cx="11.868" cy="11.868" r="2.8"/>
    </g>
  </g>
</svg>`;

async function render(svg, name, w, h = w) {
  await sharp(Buffer.from(svg)).resize(w, h).png().toFile(`${OUT}/${name}`);
  console.log(`wrote ${OUT}/${name} (${w}x${h})`);
}

await render(tileSvg, "icon-512.png", 512);
await render(tileSvg, "icon-192.png", 192);
await render(tileSvg, "apple-touch-icon.png", 180);
await render(maskableSvg, "icon-maskable-512.png", 512);
await render(ogSvg, "og-image.png", 1200, 630);
console.log("done");