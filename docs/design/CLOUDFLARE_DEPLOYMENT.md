# Astrowind + Cloudflare Deployment Guide

## Overview
Configuração completa para deploy de Astrowind (Astro 5 + Tailwind) no Cloudflare Pages/Workers com SSR.

---

## 1. Dependências e Versões Críticas

### package.json
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

**Pontos-chave:**
- Usar Astro 5.x com `@astrojs/cloudflare` v12 (compatível)
- Node 22+ obrigatório
- npm 11.6.3 no CI (garante determinismo)
- Evitar misturar npm (Windows/PowerShell) com npm (WSL/Linux) na mesma árvore `node_modules`

---

## 2. Configuração Astro (astro.config.ts)

```typescript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',  // SSR obrigatório para Cloudflare
  adapter: cloudflare(),

  markdown: {
    syntaxHighlight: 'prism',  // ✅ NÃO use 'shiki' (dependência pesada + erros em build)
    // ... resto da config
  },

  // ... outras integrações
});
```

**Motivo:** Shiki foi removido da configuração padrão do Astro e causa `ERR_MODULE_NOT_FOUND: shiki/dist/langs.mjs` durante build. Prism é mais leve e funciona sem problemas.

---

## 3. Configuração Wrangler (wrangler.jsonc)

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

**Notas:**
- `main` aponta sempre para `dist/_worker.js/index.js` (código server)
- `assets.directory: "dist"` aponta para a pasta raiz do build (contém código + static)
- `compatibility_flags` permite APIs Node.js no Cloudflare Workers

---

## 4. Auto-Bloqueio de Código Server-Side em Assets

### scripts/write-assetsignore.mjs
```javascript
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetsIgnorePath = path.join(distDir, '.assetsignore');

await mkdir(distDir, { recursive: true });
await writeFile(assetsIgnorePath, '_worker.js\n', 'utf8');

console.log('Wrote dist/.assetsignore to exclude _worker.js from public assets.');
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

**Por quê:** 
- Astro coloca código server em `dist/_worker.js`
- Wrangler varre `dist` por assets públicos
- Sem `.assetsignore`, Wrangler bloqueia deploy (risco de expor código privado)
- O `postbuild` executa automaticamente após build, garantindo o arquivo existe sempre

---

## 5. Scripts Recomendados

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

**Fluxo:**
1. `npm run dev` - desenvolvimento local com Astro
2. `npm run build` → `postbuild` - build SSR + gera `.assetsignore`
3. `npm run preview:cf` - testa localmente como será no Cloudflare
4. `npm run deploy` - deploy para Cloudflare Pages/Workers

---

## 6. Problemas Comuns e Soluções

### ❌ Erro: `ERR_MODULE_NOT_FOUND: shiki/dist/langs.mjs`
**Causa:** Configuração Astro padrão tenta carregar Shiki mas pacote não está completo.
**Solução:** Mudar para `syntaxHighlight: 'prism'` no `astro.config.ts`.

---

### ❌ Erro: `Invalid Version:` durante `npm clean-install`
**Causa:** Lockfile corrompido com entrada vazia em `node_modules/@atproto/api: {}`.
**Solução:**
```bash
rm package-lock.json
npm install --package-lock-only --ignore-scripts
```

---

### ❌ Erro: `EACCES: permission denied, rename` ou `ENOTEMPTY`
**Causa 1 (WSL/Linux):** Árvore `node_modules` parcialmente instalada com permissões inconsistentes.
**Solução:**
```bash
rm -rf node_modules
npm ci --no-audit --no-fund  # Usa lock para install determinístico
```

**Causa 2 (Windows + WSL):** Mistura de npm Windows (PowerShell) com npm WSL cria symlinks Linux incompatíveis.
**Solução:** Use um ou outro:
- **WSL only:** `npm install` no WSL bash
- **Windows only:** `npm install` no PowerShell/CMD (evita symlinks)

---

### ❌ Erro: `[ERROR] Uploading a Pages _worker.js directory as an asset`
**Causa:** Falta de `.assetsignore` em `dist`.
**Solução:** Adicionar `postbuild` script que gera `dist/.assetsignore` com conteúdo `_worker.js`.

---

### ❌ Erro: `The directory specified by the "assets.directory" ... does not exist`
**Causa:** Wrangler rodou antes de build completar ou caminho inválido.
**Solução:** Certificar que `assets.directory: "dist"` (não `dist/client`).

---

## 7. CI/CD (Cloudflare Pages)

### Configuração Build
```
Framework: Astro
Build command: npm ci --progress=false && npm run build
Publish directory: dist
```

### Key Points
- Use `npm ci` (clean install) em CI para determinismo
- `npm run build` dispara `postbuild` automaticamente
- Output em `dist/` contém `_worker.js` + assets estáticos

---

## 8. Checklist de Deploy

- [ ] `astro.config.ts`: `output: 'server'`, `adapter: cloudflare()`, `syntaxHighlight: 'prism'`
- [ ] `wrangler.jsonc`: válido, `main: "dist/_worker.js/index.js"`, `assets.directory: "dist"`
- [ ] `package.json`: `@astrojs/cloudflare ^12`, `wrangler ^4.75`, `postbuild` script definido
- [ ] `scripts/write-assetsignore.mjs`: existe e é executável
- [ ] Build local sem erros: `npm run build`
- [ ] Local preview funciona: `npm run preview:cf`
- [ ] CI build commands configurados (npm ci + npm run build)
- [ ] Nenhum `npm install` no Windows PowerShell se também usar WSL (ou vice-versa)

---

## 9. Referências Rápidas

**Docs:**
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations/cloudflare/)
- [Wrangler Config](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cloudflare Pages Build](https://developers.cloudflare.com/pages/framework-guides/astro/)

**Comandos úteis:**
```bash
# Limpar e reinstalar
rm -rf node_modules && npm ci

# Build + preview local
npm run build && npm run preview:cf

# Deploy
npm run deploy

# Debug Wrangler
wrangler deploy --config wrangler.jsonc --dry-run
```

---

## 10. Resoluções de Problemas por Sequência Temporal

### Sessão 1: Build Failures → Shiki & Adapter Fix
- Problema: `ERR_MODULE_NOT_FOUND: shiki/dist/langs.mjs`
- Fix: Mover para `syntaxHighlight: 'prism'`
- Status: ✅ Resolvido

### Sessão 2: Deploy Assets → Assets Ignore
- Problema: `[ERROR] Uploading a Pages _worker.js directory as an asset`
- Fix: Auto-gerar `dist/.assetsignore` com `postbuild` script
- Status: ✅ Resolvido

### Sessão 3: Dependency Trees → Invalid Version
- Problema: `npm clean-install` falhava com `Invalid Version:` em lockfile
- Fix: Regenerar `package-lock.json` limpo
- Status: ✅ Resolvido

### Sessão 4: Filesystem Permissions → EACCES/ENOTEMPTY
- Problema: `EACCES: permission denied, rename` / `ENOTEMPTY` em `node_modules`
- Causa: Mistura de WSL (symlinks Linux) + Windows npm ou árvore corrompida
- Fix: `rm -rf node_modules && npm ci` exclusivamente em WSL OU Windows, nunca misturar
- Status: ✅ Resolvido

---

## 11. Notas Finais

- **Determinismo:** packageManager de npm, Node >=22, npm ci em CI
- **Compatibilidade:** Cloudflare + Astro 5 usa adapter v12, não v13
- **Assets:** `.assetsignore` obrigatório para evitar expor código server
- **Syntax Highlighting:** Prism, não Shiki (Shiki removido do Astro core)
- **Ambiente:** Não misturar npm WSL com npm Windows na mesma pasta `/mnt/e`
- **Performance:** Prism é mais rápido que Shiki; nenhum impacto negativo observado

**Última atualização:** 2026-03-20
