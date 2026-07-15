# eitan-info-site — Claude Development Guide

## What this repo is

The **static marketing site** for **info.m-eitan.co.il** — the public-facing site of איתן (Israeli mortgage advisory). Built with **Astro** (static output, RTL/Hebrew content). It was migrated here from the `marketing-site/` directory of the Cobra-CRM repo, and this repo is now the single source of truth for the site.

- Main page: `src/pages/index.astro`
- New pages go in `src/pages/` — **also add them to `public/sitemap.xml`**
- Site URL is configured in `astro.config.mjs` (`https://info.m-eitan.co.il`)

## Local development & verification

```bash
npm install
npm run dev      # local dev server
npm run build    # MUST pass before any push or deploy; output goes to dist/
```

Never commit `node_modules/`, `dist/`, or `.astro/` (see `.gitignore`).

## Deployment — MANUAL ONLY

The site is hosted on a dedicated Vercel project which is **not Git-connected** — pushing to this repo does **NOT** update the live site. Deployment is always an explicit, manual step:

- **Vercel project name**: `eitan-info`
- **Vercel team**: `team_O9opabkqPpAWSiMtPRUi33qu`
- **Deploy tool**: Vercel MCP `deploy_to_vercel` with `target: "production"` (otherwise the live domain won't update)
- Send all **source files** (not `dist/`); Vercel builds with the `astro` framework preset.

### Deployment rules

1. Verify `npm run build` is green locally before deploying.
2. Show the user a summary/preview of the change and **wait for their explicit approval before deploying to the live site**. **Never deploy to production automatically.**
3. After deploying, verify the live site at `https://info.m-eitan.co.il` via `web_fetch_vercel_url` or WebFetch (the sandbox egress proxy blocks direct curl to `*.m-eitan.co.il`).

### Iron rule

Work in this repo must **never touch the `cobra-crm` Vercel project or its settings** in any way. This repo deploys exclusively to the `eitan-info` Vercel project. (For reference: the CRM app's root `vercel.json` permanently redirects `/` → `https://info.m-eitan.co.il`.)
