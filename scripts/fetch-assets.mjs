// Downloads the site's binary assets (fonts + images) when they are missing.
// Used by Vercel deployments, where only text source files are uploaded;
// in a full git checkout every file already exists and this is a no-op.
// Pinned to the commit that contains the canonical binaries.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REPO_RAW =
  'https://raw.githubusercontent.com/kobibest/eitan-info-site/6555aaee4d527c5799253896f9d5ac8f146f0b9d';

const ASSETS = [
  'public/apple-touch-icon.png',
  'public/og-image.png',
  'public/fonts/heebo-hebrew.woff2',
  'public/fonts/heebo-latin.woff2',
  'public/fonts/heebo-latin-ext.woff2',
];

const root = join(dirname(new URL(import.meta.url).pathname), '..');

for (const asset of ASSETS) {
  const target = join(root, asset);
  if (existsSync(target)) continue;
  const url = `${REPO_RAW}/${asset}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  console.log(`fetched ${asset}`);
}
