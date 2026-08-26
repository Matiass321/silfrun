/**
 * Submits every public URL to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to notice a
 * change, the site tells the engines directly. Bing, Yandex, Seznam and Naver
 * consume it. Google does not participate — Search Console is still the only
 * way to reach Google, and that needs an account this script cannot have.
 *
 * Ownership is proved by a key file served from the site root. The key is not
 * a secret: it proves that whoever submits URLs also controls the host.
 *
 *   node scripts/indexnow.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ENDPOINT = 'https://api.indexnow.org/IndexNow';

/* The key is whichever <32-hex>.txt sits in public/. */
const keyFile = fs.readdirSync(path.join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file in public/. Expected <32-hex>.txt');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');

/**
 * URLs come from the built sitemap, not from a hand-written list.
 *
 * The sitemap is generated from the route table, so it is the only source that
 * cannot fall out of step with what is actually published.
 */
const sitemapPath = path.join(root, 'dist', 'sitemap-0.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('dist/sitemap-0.xml not found. Run `npm run build` first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urls.length) {
  console.error('No URLs found in the sitemap.');
  process.exit(1);
}

/**
 * The host is read off the sitemap rather than written here.
 *
 * IndexNow rejects a submission whose host does not match the URLs, so a
 * hardcoded constant turns into a silent failure the day the primary domain
 * changes — which is exactly what happened moving from .com to .is.
 */
const HOST = new URL(urls[0]).host;

const foreign = urls.filter((u) => new URL(u).host !== HOST);
if (foreign.length) {
  console.error(`Sitemap mixes hosts: ${foreign.length} URLs are not on ${HOST}.`);
  process.exit(1);
}

const body = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${keyFile}`,
  urlList: urls,
};

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

/* 200 accepted, 202 accepted pending key validation. Both are success. */
if (res.status === 200 || res.status === 202) {
  console.log(`Submitted ${urls.length} URLs to IndexNow — HTTP ${res.status}`);
} else {
  console.error(`IndexNow returned HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}
