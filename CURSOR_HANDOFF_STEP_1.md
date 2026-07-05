# Cursor Handoff — Step 1: Foundation Setup

## Summary

Step 1 establishes a production-quality frontend foundation for the **Security Bundle Builder** take-home prototype. Tailwind CSS, ESLint, Prettier, and strict TypeScript are configured. A minimal two-column app shell (builder left, review panel right) is in place. No product UI or business logic has been implemented.

## What changed

- Replaced the default Vite starter UI with a structured app shell and feature-oriented folder layout.
- Installed and configured **Tailwind CSS v4** via `@tailwindcss/vite`.
- Added **Figma-derived design tokens** in `src/styles/tokens.css` (Wyze purple, Gray-C palette, semantic colors).
- Added **ESLint** (flat config) and **Prettier** with npm scripts for lint, format, and typecheck.
- Enabled **TypeScript strict mode** plus `noUncheckedIndexedAccess`.
- Configured **`@/` path alias** in Vite and `tsconfig.app.json`.
- Removed obsolete starter files (`src/App.tsx`, `src/App.css`, `src/index.css`).

## Figma inspection (design context only)

- **File:** `uV3xhhk46YJliaJEsDgIQI`
- **Node inspected:** `1:858` (product card component)
- **Variables extracted:** `core/wyze purple`, `Gray-C/400`, `Gray-C/300`, `Gray-C/Obsidian`, `Gray-C/700`, `Gray-C/200`
- **Additional colors noted from design:** text primary/secondary, link blue, sale red, selection mint green
- Tokens were mapped into `src/styles/tokens.css` for use in later UI steps. No product card UI was built.

## Files created

### Configuration

| File               | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `eslint.config.js` | ESLint flat config (TypeScript + React Hooks + Prettier compat) |
| `.prettierrc`      | Prettier formatting rules                                       |
| `.prettierignore`  | Prettier ignore patterns                                        |

### Source — app & styles

| File                     | Purpose                       |
| ------------------------ | ----------------------------- |
| `src/app/App.tsx`        | Root app component            |
| `src/app/index.ts`       | App barrel export             |
| `src/styles/tokens.css`  | Design tokens from Figma      |
| `src/styles/globals.css` | Tailwind import + base styles |

### Source — components

| File                                              | Purpose                         |
| ------------------------------------------------- | ------------------------------- |
| `src/components/common/PlaceholderPanel.tsx`      | Reusable placeholder panel      |
| `src/components/common/index.ts`                  | Barrel export                   |
| `src/components/layout/AppShell.tsx`              | Page shell with two-column grid |
| `src/components/layout/MainContainer.tsx`         | Centered max-width container    |
| `src/components/layout/index.ts`                  | Barrel export                   |
| `src/components/bundle-builder/BuilderArea.tsx`   | Left builder placeholder        |
| `src/components/bundle-builder/index.ts`          | Barrel export                   |
| `src/components/review-panel/ReviewPanelArea.tsx` | Right review placeholder        |
| `src/components/review-panel/index.ts`            | Barrel export                   |

### Source — architecture placeholders

| File                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `src/types/bundle.ts`            | Bundle-related type stubs           |
| `src/types/index.ts`             | Types barrel export                 |
| `src/data/products.ts`           | Catalog placeholder                 |
| `src/data/index.ts`              | Data barrel export                  |
| `src/lib/constants.ts`           | App constants                       |
| `src/lib/index.ts`               | Lib barrel export                   |
| `src/hooks/index.ts`             | Hooks placeholder                   |
| `src/utils/formatCurrency.ts`    | Currency formatting utility         |
| `src/utils/index.ts`             | Utils barrel export                 |
| `src/assets/icons/.gitkeep`      | Icons directory placeholder         |
| `src/assets/products/.gitkeep`   | Product images placeholder          |
| `src/assets/references/.gitkeep` | Design reference assets placeholder |

### Documentation

| File                       | Purpose                       |
| -------------------------- | ----------------------------- |
| `README.md`                | Project overview and commands |
| `CURSOR_HANDOFF_STEP_1.md` | This handoff document         |

## Files updated

| File                | Changes                                                |
| ------------------- | ------------------------------------------------------ |
| `package.json`      | Renamed project, added scripts and new dependencies    |
| `vite.config.ts`    | Tailwind plugin + `@/` alias                           |
| `tsconfig.app.json` | Strict mode, path alias, `ignoreDeprecations` for TS 6 |
| `src/main.tsx`      | Imports from `@/app` and `@/styles/globals.css`        |
| `index.html`        | Updated page title                                     |

## Files removed

| File            | Reason                               |
| --------------- | ------------------------------------ |
| `src/App.tsx`   | Replaced by `src/app/App.tsx`        |
| `src/App.css`   | Replaced by Tailwind + `globals.css` |
| `src/index.css` | Replaced by `src/styles/globals.css` |

## Packages installed

### Dependencies

- `tailwindcss`
- `@tailwindcss/vite`

### Dev dependencies

- `prettier`
- `eslint`
- `@eslint/js`
- `eslint-config-prettier`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `typescript-eslint`
- `globals`

## Commands run

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D prettier eslint eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-react-refresh @eslint/js typescript-eslint globals
npm run typecheck   # PASS
npm run lint        # PASS
npm run build       # PASS
npm run format:check # PASS
```

## Assumptions

1. **Gilroy font** is referenced in tokens as a preferred stack fallback; font files are not bundled yet. System UI fonts are used until custom fonts are added.
2. The Figma URL node (`1:858`) is a **product card**, not the full page layout. The two-column shell follows the stated bundle-builder + review-panel architecture rather than inferring a full-page frame from Figma.
3. **Oxlint** remains available via `npm run lint:ox` but **ESLint** is the primary lint script per requirements.
4. **`@/` path alias** uses `baseUrl` with `ignoreDeprecations: "6.0"` because TypeScript 6 deprecates `baseUrl` without a full migration path yet in this template.

## Issues and warnings

| Item                             | Severity | Notes                                                                                                                          |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript `baseUrl` deprecation | Warning  | Silenced via `"ignoreDeprecations": "6.0"` in `tsconfig.app.json`. Consider migrating to TS 7 path resolution when available.  |
| Gilroy font not loaded           | Info     | Design uses Gilroy; app falls back to system UI fonts for now.                                                                 |
| Figma MCP asset URLs             | Info     | Remote asset URLs from Figma expire in ~7 days; product images should be downloaded to `src/assets/products/` in a later step. |
| Product catalog empty            | Expected | `src/data/products.ts` is intentionally a placeholder.                                                                         |

## Verification

| Check                       | Status               |
| --------------------------- | -------------------- |
| `npm run typecheck`         | **PASS**             |
| `npm run lint`              | **PASS**             |
| `npm run build`             | **PASS**             |
| `npm run format:check`      | **PASS**             |
| Tailwind configured         | **Yes**              |
| Folder structure in place   | **Yes**              |
| Full product UI implemented | **No** (intentional) |

## Suggested next step (Step 2)

1. **Implement the product card component** from Figma node `1:858` using Tailwind tokens (`ProductCard`, variant selector, quantity stepper, price display).
2. **Add static product data** in `src/data/products.ts` with typed models in `src/types/`.
3. **Download product images** from Figma into `src/assets/products/`.
4. **Introduce bundle builder state** via a custom hook (e.g. `useBundleBuilder`) in `src/hooks/`.
5. **Wire the review panel** to display selected items and running totals using `formatCurrency`.

Run `npm run dev` to preview the placeholder shell locally.
