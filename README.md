# Security Bundle Builder

A React + TypeScript prototype for a multi-step security system bundle builder. This repository is being built incrementally against a Figma design.

## Tech stack

- **React 19** with TypeScript (strict mode)
- **Vite** for dev server and production builds
- **Tailwind CSS v4** with Figma-derived design tokens
- **Vitest** + **React Testing Library** for unit and component tests
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
- **Provider** — `BundleBuilderProvider` shares one `useBundleBuilder` instance between `AccordionBuilder` and `ReviewPanel`.
- **UI primitives** — `src/components/common/` provides reusable building blocks (`QuantityStepper`, `PriceDisplay`, `VariantSelector`, etc.).
- **ProductCard** — `src/components/bundle-builder/ProductCard.tsx` is fully data-driven from the `Product` type.

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

### Assets

| Location                 | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `src/assets/products/`   | Product and variant images (`.png`) — 5 real, 13 placeholders           |
| `src/assets/icons/`      | Step icons, chevrons, plus/minus, shipping truck (SVG); guarantee (PNG) |
| `src/assets/references/` | Figma design reference screenshots — layout source-of-truth for Step 4+ |

**Note:** Five camera product images and the satisfaction badge were promoted from `src/assets/references/`. Remaining catalog images are placeholders from `scripts/generate-placeholders.mjs`. Catalog paths in `src/data/products.ts` are stable for drop-in replacement.

### ProductCard

`ProductCard` receives all state from its parent — it does not read global bundle state directly. Props: `product`, `activeVariantId`, `quantity`, `onVariantChange`, `onIncrement`, `onDecrement`, optional `compact` for accordion grid layout. Selected state is driven by the active line quantity (> 0). Layout is **horizontal** on desktop (image left, content right) per `src/assets/references/Frame 543.png`.

### Accordion builder

`AccordionBuilder` in `BuilderArea` renders the 4-step accordion from `BUNDLE_STEPS`. Accordion open-step state (`openStepId`) is **local UI state** — separate from bundle product selection. Both accordion and review panel consume shared bundle state via `useBundleBuilderContext()`. Step headers show distinct selected-line counts via `selectedCountByStep` (purple). Product cards render from `PRODUCT_CATALOG` in a responsive grid (`1` column mobile, `2` columns desktop).

### Review panel

`ReviewPanel` in `ReviewPanelArea` displays the live "Your security system" summary. It reads `groupedSelectedItems`, `pricingSummary`, and `shippingSummary` from shared context. Items render under Cameras → Sensors → Accessories → Plan; **Fast Shipping** is a separate row below Plan. Quantity steppers call the same `increment` / `decrement` handlers as the accordion (with optional `variantId` for variant lines). Checkout and Save links show placeholder alerts only — persistence is not implemented yet.

## Project structure

```
src/
  app/                 # App entry composition
  assets/              # Static assets (icons, product images, references)
  components/
    common/            # Shared UI primitives (QuantityStepper, PriceDisplay, …)
    layout/            # App shell and layout
    bundle-builder/    # AccordionBuilder, ProductCard, BuilderArea, BundleBuilderProvider
    review-panel/      # ReviewPanel, ReviewLineItem, ReviewPanelArea
  data/                # Static catalog and bundle steps
  hooks/               # useBundleBuilder state hook
  lib/bundle/          # Pure bundle business logic + tests
  lib/productDisplay.ts # Display pricing helpers for ProductCard
  styles/              # Global styles and design tokens
  test/                # Vitest + Testing Library setup
  types/               # Shared TypeScript types
  utils/               # Re-exports and formatting helpers
```

## Current status

**Step 5 completed: shared bundle state provider and live review panel.**

- `BundleBuilderProvider` shares one bundle state instance across the page.
- Accordion and ReviewPanel stay synchronized (quantity changes sync both ways).
- ReviewPanel consumes selected grouped items, shipping summary, and pricing summary.
- localStorage persistence is still pending.

## Design reference

Figma: [Untitled — node 1:858](https://www.figma.com/design/uV3xhhk46YJliaJEsDgIQI/Untitled?node-id=1-858)

Design tokens (Wyze purple, Gray-C palette, semantic colors) are defined in `src/styles/tokens.css`.
