# Security Bundle Builder

A React + TypeScript prototype for a multi-step security system bundle builder. This repository is being built incrementally against a Figma design.

## Tech stack

- **React 19** with TypeScript (strict mode)
- **Vite** for dev server and production builds
- **Tailwind CSS v4** with Figma-derived design tokens
- **Vitest** for unit tests
- **ESLint** + **Prettier** for code quality
- **Oxlint** available as an optional fast linter (`npm run lint:ox`)

## Getting started

### Install

```bash
npm install
```

### Dev

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run test:watch
npm run format
npm run format:check
```

## Architecture

This project uses a **data-driven architecture**:

- **Catalog** — `src/data/products.ts` and `src/data/bundleSteps.ts` define products, variants, steps, and seeded quantities.
- **Domain types** — `src/types/bundle.ts` models products, configuration state, selected items, and pricing.
- **Pure utilities** — `src/lib/bundle/` contains stateless functions for quantity changes, selection, grouping, and pricing.
- **Hook** — `src/hooks/useBundleBuilder.ts` wires configuration state to derived selectors for UI layers.

### Prices in cents

All monetary values are stored as **integer cents** (e.g. `2798` = $27.98). Use `formatCurrency(cents)` from `src/utils/formatCurrency.ts` for display.

### Variant quantity behavior

- Products **with variants** track quantity per variant independently.
- The **active variant** controls which variant increment/decrement affects.
- Switching active variant does **not** reset other variant quantities.
- The review panel lists **each variant with quantity > 0** as a separate line item.

### Selected counters vs quantity

Accordion step counters (`getSelectedCountByStep`) count **distinct selected lines** — one per product or per variant with quantity > 0. Quantity does not increase the count (e.g. Wyze Cam Pan v3 qty 2 counts as 1 selected). Use `getSelectedQuantityByStep` when you need total units per step.

### Shipping summary

**Fast Shipping** is modeled as a fixed `ShippingSummaryRow` (`BUNDLE_SHIPPING_SUMMARY`), not as a catalog product. It appears in the review panel separately, does not affect selected counts, and is excluded from product savings. Display: compare-at $5.99 struck through, active price **FREE**.

### Initial pricing (Figma-aligned)

Seeded selection produces:

| Field            | Value   |
| ---------------- | ------- |
| Total            | $187.89 |
| Compare-at total | $238.81 |
| Savings          | $50.92  |

### Product data

| Location                  | Purpose                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| `src/data/products.ts`    | Full product catalog with prices, variants, initial quantities           |
| `src/data/bundleSteps.ts` | Four builder accordion steps                                             |
| `src/assets/products/`    | Product image assets (placeholder paths defined; files pending download) |

## Project structure

```
src/
  app/                 # App entry composition
  assets/              # Static assets (icons, product images, references)
  components/
    common/            # Shared UI primitives
    layout/            # App shell and layout
    bundle-builder/    # Builder flow (placeholder)
    review-panel/      # Review sidebar (placeholder)
  data/                # Static catalog and bundle steps
  hooks/               # useBundleBuilder state hook
  lib/bundle/          # Pure bundle business logic + tests
  styles/              # Global styles and design tokens
  types/               # Shared TypeScript types
  utils/               # Re-exports and formatting helpers
```

## Current status

**Step 2.1 completed: data accuracy, selected-count logic, shipping model, and Figma-aligned pricing.**

UI components (product cards, accordion, review panel) are not implemented yet.

## Design reference

Figma: [Untitled — node 1:858](https://www.figma.com/design/uV3xhhk46YJliaJEsDgIQI/Untitled?node-id=1-858)

Design tokens (Wyze purple, Gray-C palette, semantic colors) are defined in `src/styles/tokens.css`.
