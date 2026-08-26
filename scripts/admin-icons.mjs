/**
 * Renders the admin home-screen icons.
 *
 * Run by hand (`npm run icons`) rather than on every build — they change only
 * when the mark does, and rasterising them each deploy would put sharp in the
 * build for four files that come out byte-identical.
 *
 * The maskable variant carries far more padding than the others. Android crops
 * a maskable icon to whatever shape the launcher uses — circle, squircle,
 * teardrop — and anything inside the outer 20% can be cut off.
 */
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const INK = '#14181c';
const BG = '#ffffff';

/** The lozenge, at a given scale, on a plain ground. */
const mark = (size, pad) => {
  const inner = size - pad * 2;
  const w = inner * 0.62;
  const h = inner;
  const x = (size - w) / 2;
  const y = pad;
  const s = w / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${BG}"/>
    <g transform="translate(${x} ${y}) scale(${s} ${h / 64})" fill="none">
      <path d="M24 2 Q16 17 6 32 Q16 47 24 62 Z" fill="${INK}" opacity="0.12"/>
      <path d="M24 2 Q32 17 42 32 Q32 47 24 62 Q16 47 6 32 Q16 17 24 2 Z"
            stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M24 2 V62" stroke="${INK}" stroke-width="1.4" opacity="0.42"/>
    </g>
  </svg>`;
};

const jobs = [
  { file: 'admin-icon-180.png', size: 180, pad: 30 },
  { file: 'admin-icon-192.png', size: 192, pad: 32 },
  { file: 'admin-icon-512.png', size: 512, pad: 86 },
  // 20% inset on every edge, so a circular crop still shows the whole mark.
  { file: 'admin-icon-maskable.png', size: 512, pad: 128 },
];

for (const j of jobs) {
  const out = path.join(root, 'public', j.file);
  await sharp(Buffer.from(mark(j.size, j.pad))).png({ compressionLevel: 9 }).toFile(out);
  const { size } = fs.statSync(out);
  console.log(`${j.file.padEnd(26)} ${j.size}x${j.size}  ${(size / 1024).toFixed(1)} kB`);
}
