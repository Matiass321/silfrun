/**
 * Renders the social card to public/og.png.
 *
 * Run by hand (`npm run og`) rather than on every build: the card only changes
 * when the brand does, and rasterising it on each deploy would add a sharp
 * dependency to the build for a file that is byte-identical every time.
 *
 * 1200x630 is the size Facebook, LinkedIn, WhatsApp and X all crop from. The
 * mark and wordmark sit left of centre so the right third stays clear, which
 * is where several platforms overlay their own chrome.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const W = 1200;
const H = 630;

/* Palette copied from src/styles/tokens.css. Kept literal because this file is
   rasterised outside the CSS pipeline and cannot read custom properties. */
const BASALT = '#0B0D0F';
const SILVER_050 = '#F2F4F6';
const SILVER_300 = '#BAC1C8';
const SILVER_500 = '#7B838C';

const fontDir = path.join(root, 'node_modules/@fontsource/marcellus/files');
const archivoDir = path.join(root, 'node_modules/@fontsource-variable/archivo/files');

/** Embeds a font file so the SVG rasterises identically without system fonts. */
function embed(dir, match) {
  const file = fs.readdirSync(dir).find((f) => match.test(f));
  if (!file) throw new Error(`No font matching ${match} in ${dir}`);
  return fs.readFileSync(path.join(dir, file)).toString('base64');
}

const marcellus = embed(fontDir, /marcellus-latin-400-normal\.woff2?$/);
const archivo = embed(archivoDir, /archivo-latin-wght-normal\.woff2?$/);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face { font-family: 'Marcellus'; src: url(data:font/woff2;base64,${marcellus}) format('woff2'); }
      @font-face { font-family: 'Archivo'; src: url(data:font/woff2;base64,${archivo}) format('woff2'); }
      .word { font-family: 'Marcellus', serif; font-size: 76px; letter-spacing: 25.8px; fill: url(#foil); }
      .tag  { font-family: 'Archivo', sans-serif; font-size: 21px; font-weight: 500; letter-spacing: 4.6px; fill: ${SILVER_500}; text-transform: uppercase; }
      .line { font-family: 'Marcellus', serif; font-size: 40px; letter-spacing: -0.8px; fill: ${SILVER_300}; }
    </style>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0.25">
      <stop offset="0%" stop-color="#5D656E"/>
      <stop offset="16%" stop-color="#BAC1C8"/>
      <stop offset="31%" stop-color="#F2F4F6"/>
      <stop offset="46%" stop-color="#9AA2AA"/>
      <stop offset="62%" stop-color="#E4E8EB"/>
      <stop offset="80%" stop-color="#7B838C"/>
      <stop offset="100%" stop-color="#D2D7DC"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E2E8EE" stop-opacity="0"/>
      <stop offset="30%" stop-color="#E2E8EE" stop-opacity="0.55"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#E2E8EE" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#E2E8EE" stop-opacity="0"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${BASALT}"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.17"/>

  <!-- The cut lozenge, same geometry as the site mark. -->
  <g transform="translate(96 208) scale(2.05)" fill="none">
    <path d="M24 2 Q16 17 6 32 Q16 47 24 62 Z" fill="${SILVER_300}" opacity="0.10"/>
    <path d="M24 2 Q32 17 42 32 Q32 47 24 62 Q16 47 6 32 Q16 17 24 2 Z"
          stroke="${SILVER_050}" stroke-width="1.25" stroke-linejoin="round"/>
    <path d="M24 2 V62" stroke="${SILVER_050}" stroke-width="0.75" opacity="0.45"/>
  </g>

  <text class="word" x="240" y="300">SILFRÚN</text>
  <text class="tag"  x="243" y="346">SÉRHÆFÐ HREINSUN · REYKJAVÍK</text>

  <rect x="240" y="392" width="176" height="1" fill="url(#hair)"/>

  <text class="line" x="240" y="466">Umhirða fyrir húsgögn</text>
  <text class="line" x="240" y="516">sem eiga að endast.</text>

  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="url(#hair)" opacity="0.5"/>
</svg>`;

const out = path.join(root, 'public', 'og.png');
/*
 * Quantised to a palette. The card is a flat dark ground, one gradient and
 * some text, so 128 colours are indistinguishable from truecolour here — but
 * the grain gives a truecolour PNG enormous entropy, and the file goes from
 * ~680 kB to well under 100 kB. Several chat clients refuse to fetch large
 * preview images, so this is a functional fix, not just a tidy one.
 */
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, palette: true, colours: 128, effort: 10 })
  .toFile(out);

const { size } = fs.statSync(out);
console.log(`og.png written — ${W}x${H}, ${(size / 1024).toFixed(1)} kB`);
