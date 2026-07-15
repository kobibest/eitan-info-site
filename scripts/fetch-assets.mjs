// Syncs the full site source from the public GitHub repo when files are
// missing. Vercel deployments upload only package.json + this script; the
// build then pulls everything else (src/, public/, config) from the branch.
// In a full git checkout every file already exists and this is a no-op.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REPO = 'kobibest/eitan-info-site';
const REF = 'claude/landing-page-design-6i326j';

const root = join(dirname(new URL(import.meta.url).pathname), '..');

const treeRes = await fetch(
  `https://api.github.com/repos/${REPO}/git/trees/${encodeURIComponent(REF)}?recursive=1`,
  { headers: { accept: 'application/vnd.github+json' } }
);
if (!treeRes.ok) {
  throw new Error(`Failed to list repo tree: ${treeRes.status} ${treeRes.statusText}`);
}
const { tree, truncated } = await treeRes.json();
if (truncated) throw new Error('Repo tree listing was truncated');

const skip = /^(\.|node_modules\/|dist\/|scripts\/|CLAUDE\.md|README\.md|package(-lock)?\.json)/;
const files = tree.filter((e) => e.type === 'blob' && !skip.test(e.path));

let fetched = 0;
for (const { path } of files) {
  const target = join(root, path);
  if (existsSync(target)) continue;
  const res = await fetch(
    `https://raw.githubusercontent.com/${REPO}/${encodeURIComponent(REF)}/${path}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  fetched++;
  console.log(`fetched ${path}`);
}
console.log(`sync done: ${fetched} fetched, ${files.length - fetched} already present`);
