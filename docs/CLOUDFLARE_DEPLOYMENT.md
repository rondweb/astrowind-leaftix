# Astrowind + Cloudflare Deployment Guide

## Overview
Configuração completa para deploy de Astrowind (Astro 5 + Tailwind) no Cloudflare Pages/Workers com SSR.

---

## 1. Dependências e Versões Críticas

### package.json Requirements
```json
{
  "engines": {
    "node": ">=22.0.0"
  },
  "packageManager": "npm@11.6.3",
  "devDependencies": {
    "@astrojs/cloudflare": "^12.0.0",
    "wrangler": "^4.75.0"
  }
}
```

**Key Points:**
- Astro 5.x requires `@astrojs/cloudflare` v12 (not v13)
- Node 22+ is mandatory
- npm 11.6.3 ensures deterministic builds in CI
- Never mix Windows npm with WSL npm on same node_modules tree

---

## 2. Astro Configuration (astro.config.ts)

```typescript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',  // SSR required for Cloudflare
  adapter: cloudflare(),

  markdown: {
    syntaxHighlight: 'prism',  // ✅ Use Prism, NOT Shiki
  },
});
```

**Why Prism?** Shiki causes `ERR_MODULE_NOT_FOUND: shiki/dist/langs.mjs` during build and was removed from Astro core. Prism is lightweight and works perfectly.

---

## 3. Wrangler Configuration (wrangler.jsonc)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "astrowind-leaftix",
  "main": "dist/_worker.js/index.js",
  "compatibility_date": "2026-03-19",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "dist"
  },
  "observability": {
    "enabled": true
  }
}
```

---

## 4. Auto-Protect Server Code from Assets (Critical!)

### scripts/write-assetsignore.mjs
```javascript
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetsIgnorePath = path.join(distDir, '.assetsignore');

await mkdir(distDir, { recursive: true });
await writeFile(assetsIgnorePath, '_worker.js\n', 'utf8');
```

### package.json
```json
{
  "scripts": {
    "build": "astro build",
    "postbuild": "node scripts/write-assetsignore.mjs",
    "deploy": "npm run build && wrangler deploy --config wrangler.jsonc"
  }
}
```

**Why?** Astro puts server code in `dist/_worker.js`, but Wrangler scans `dist` for public assets. Without `.assetsignore`, Wrangler blocks deployment to prevent code exposure.

---

## 5. Deployment Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "postbuild": "node scripts/write-assetsignore.mjs",
    "preview": "astro preview",
    "preview:cf": "npm run build && wrangler dev --config wrangler.jsonc",
    "deploy": "npm run build && wrangler deploy --config wrangler.jsonc"
  }
}
```

---

## 6. Common Issues & Solutions

### ERR_MODULE_NOT_FOUND: shiki/dist/langs.mjs
- **Fix:** Use `syntaxHighlight: 'prism'` in astro.config.ts

### Invalid Version during npm clean-install
- **Cause:** Corrupted lockfile
- **Fix:** `rm package-lock.json && npm install --package-lock-only`

### EACCES: permission denied, rename
- **Cause 1 (WSL):** Corrupted node_modules
- **Fix:** `rm -rf node_modules && npm ci --no-audit --no-fund`
- **Cause 2 (Windows+WSL mix):** Incompatible symlinks
- **Fix:** Use WSL OR Windows npm exclusively, not both

### [ERROR] Uploading a Pages _worker.js directory as an asset
- **Fix:** Ensure postbuild script creates dist/.assetsignore

---

## 7. CI/CD Setup (Cloudflare Pages)

```
Framework: Astro
Build command: npm ci --progress=false && npm run build
Publish directory: dist
```

---

## 8. Pre-Deploy Checklist

- [ ] `astro.config.ts`: `output: 'server'`, `adapter: cloudflare()`, `syntaxHighlight: 'prism'`
- [ ] `wrangler.jsonc`: Valid JSON, correct paths
- [ ] `package.json`: `@astrojs/cloudflare ^12`, `wrangler ^4.75`, `postbuild` script
- [ ] `scripts/write-assetsignore.mjs`: Exists and executable
- [ ] Local build works: `npm run build`
- [ ] Local preview works: `npm run preview:cf`
- [ ] CI commands configured
- [ ] No mixing of Windows/WSL npm

---

## 9. Quick Reference

```bash
# Clean install
rm -rf node_modules && npm ci

# Build + local preview
npm run build && npm run preview:cf

# Deploy to Cloudflare
npm run deploy

# Dry run
wrangler deploy --config wrangler.jsonc --dry-run
```

---

## 10. Documentation

- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations/cloudflare/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cloudflare Pages Astro Guide](https://developers.cloudflare.com/pages/framework-guides/astro/)

---

**Last Updated:** 2026-03-20
