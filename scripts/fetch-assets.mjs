// Syncs missing site source files from the public GitHub repo.
// Vercel deployments upload only package.json + this script; the build then
// pulls everything else (src/, public/, config) listed in
// scripts/deploy-manifest.txt on the pinned branch. In a full git checkout
// every file already exists and this is a no-op.
// After adding/removing files in the repo, regenerate the manifest:
//   git ls-files | grep -vE '^(\.|scripts/|CLAUDE\.md|README\.md|package(-lock)?\.json)' > scripts/deploy-manifest.txt
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REPO = 'kobibest/eitan-info-site';
const REF = 'claude/landing-page-design-6i326j';
const RAW = `https://raw.githubusercontent.com/${REPO}/${encodeURIComponent(REF)}`;

const root = join(dirname(new URL(import.meta.url).pathname), '..');

async function fetchOk(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res;
}

const manifest = (await (await fetchOk(`${RAW}/scripts/deploy-manifest.txt`)).text())
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.includes('..'));

let fetched = 0;
for (const path of manifest) {
  const target = join(root, path);
  if (existsSync(target)) continue;
  const res = await fetchOk(`${RAW}/${path}`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  fetched++;
  console.log(`fetched ${path}`);
}
console.log(`sync done: ${fetched} fetched, ${manifest.length - fetched} already present`);
