# Security Bundle Builder

A responsive React + TypeScript take-home prototype for building a personalized Wyze security system. Users configure cameras, plan, sensors, and accessories in a multi-step accordion, then review pricing and selections in a live summary panel.

**Live demo:** _Coming soon — add deployment URL here._

## Tech stack

- React 19 + TypeScript (strict mode)
- Vite
- Tailwind CSS v4 with Figma-derived design tokens
- Vitest + React Testing Library
- ESLint + Prettier

## Features

- Four-step accordion builder driven by catalog data
- Data-driven `ProductCard` with variant selection and quantity steppers
- Live review panel synced with the builder
- Distinct selected-line counters per step (not total units)
- Pricing summary with compare-at totals and savings
- Fast Shipping shown separately from product savings
- Save/restore bundle configuration via `localStorage`
- Non-blocking toast feedback for checkout and save actions
- Responsive layout from mobile through desktop
- Accessible accordion, steppers, variant selector, and toast notifications

## Getting started

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Test

```bash
npm run test
npm run test:watch
```

### Build

```bash
npm run build
npm run preview
```

### Quality checks

```bash
npm run typecheck
npm run lint
npm run format
npm run format:check
```

## Architecture overview

The app separates catalog data, pure domain logic, shared state, and UI layers.

```
src/
  app/                 # App entry composition
  assets/              # Product images and UI icons
  components/
    common/            # Reusable primitives (QuantityStepper, PriceDisplay, Toast, …)
    layout/            # App shell and responsive container
    bundle-builder/    # AccordionBuilder, ProductCard, shared provider
    review-panel/      # ReviewPanel and line items
  data/                # Product catalog and bundle steps
  hooks/               # useBundleBuilder state hook
  lib/bundle/          # Pure bundle logic (quantities, pricing, persistence)
  lib/productDisplay.ts
  styles/              # Global styles and design tokens
  test/                # Vitest setup and render helpers
  types/               # Shared TypeScript types
  utils/               # formatCurrency helper
```

**Data flow:** `PRODUCT_CATALOG` and `BUNDLE_STEPS` define what can be selected. `useBundleBuilder` holds `BundleConfiguration` (quantities + active variants). Pure functions in `src/lib/bundle/` derive selected items, grouped review sections, pricing, and step counts. `BundleBuilderProvider` shares one hook instance between `AccordionBuilder` and `ReviewPanel`.

## Data-driven catalog

Products, variants, prices, badges, and seeded quantities live in `src/data/products.ts`. Bundle step metadata lives in `src/data/bundleSteps.ts`. UI components render from these types rather than hard-coded product branches.

All monetary values are stored as **integer cents** (e.g. `2798` = $27.98). Display formatting uses `formatCurrency()` from `src/utils/formatCurrency.ts`.

## Variant quantity behavior

- Products with variants track quantity **per variant**, independently.
- The active variant controls which variant increment/decrement affects in the accordion.
- Switching active variant does not reset other variant quantities.
- The review panel lists each variant with quantity > 0 as its own line item.

## Selected counters vs quantity

Accordion step counters count **distinct selected lines** — one per product or per variant with quantity > 0. Quantity does not increase the count (Wyze Cam Pan v3 at qty 2 still counts as 1 selected camera line).

## Review panel sync

`AccordionBuilder` and `ReviewPanel` both consume `useBundleBuilderContext()`. Quantity changes in either surface call the same `increment` / `decrement` handlers, so totals, line items, and step counts stay in sync without duplicate state.

## Persistence

Bundle configuration is saved client-side under **`bundle-builder-config-v1`**.

| Stored                | Not stored                          |
| --------------------- | ----------------------------------- |
| `quantities.products` | `selectedItems`, grouped items      |
| `quantities.variants` | `pricingSummary`, totals, savings   |
| `activeVariants`      | Shipping summary, derived selectors |

**Save:** "Save my system for later" writes the current configuration to `localStorage`. There is no auto-save on every change.

**Restore:** On load, `useBundleBuilder` reads saved data via `loadBundleConfiguration()`. Valid payloads restore quantities and active variants.

**Invalid data:** Missing key, invalid JSON, unknown product/variant ids, or malformed payloads fall back to seeded defaults without crashing.

### Reset saved demo state

Because the app persists configuration, a previous visit may show different selections than the Figma defaults. To reset in the browser console:

```js
localStorage.removeItem('bundle-builder-config-v1')
location.reload()
```

### Clean default state (Figma-aligned)

With empty `localStorage`, the seeded configuration produces:

| Field            | Value   |
| ---------------- | ------- |
| Total            | $187.89 |
| Compare-at total | $238.81 |
| Savings          | $50.92  |

| Step                 | Selected count |
| -------------------- | -------------- |
| Cameras              | 2              |
| Plan                 | 1              |
| Sensors              | 2              |
| Add extra protection | 1              |

## Accessibility

- Accordion headers use `button` elements with `aria-expanded` and `aria-controls`.
- Quantity steppers are keyboard-operable buttons with descriptive labels.
- Variant selector uses a `radiogroup` with labeled radio buttons.
- Toasts use `aria-live="polite"` and dismissible `role="status"` messages.
- Focus-visible outlines are applied to interactive controls.
- Product cards use semantic `article` elements with `aria-label`.
- Decorative images use empty `alt` text and `aria-hidden` where appropriate.

## Responsive behavior

| Breakpoint            | Layout                                                            |
| --------------------- | ----------------------------------------------------------------- |
| Mobile / tablet       | Single column — builder first, review panel below                 |
| Large desktop (`lg+`) | Two columns — builder left, sticky review panel right (`20.5rem`) |

"Let's get started!" renders as an `<h1>` on mobile/tablet only; desktop layouts omit it per the design references.

Toasts appear at the top on mobile and bottom-center on larger screens so they do not cover checkout/save actions.

## Tradeoffs and assumptions

- **Product images:** All catalog image paths resolve to files in `src/assets/products/`. Several non-camera images are simple generated placeholders where production assets were unavailable. Paths in `src/data/products.ts` are stable for drop-in replacement.
- **Financing pill** ("as low as $19.19/mo") is static, not computed from bundle total.
- **Checkout** shows prototype feedback only; no payment flow.
- **Gilroy font** falls back to system sans-serif unless loaded separately.
- **Shipping** is a fixed summary row, not a selectable catalog product.
- **Odd product grid centering** uses CSS so the last card in an odd-count step centers on desktop; exact pixel parity is not guaranteed at every breakpoint.

## What I would improve with more time

- Replace remaining placeholder product images with exported Figma assets.
- Add integration tests for full-page responsive layouts at key breakpoints.
- Compute financing messaging from bundle total.
- Add URL-based deep linking for saved bundles.
- Introduce error boundaries and telemetry around persistence failures.
- Add animation for accordion expand/collapse and toast enter/exit.
- Extract a small design-system package for shared tokens and primitives.

## Design reference

Figma: [Frontend Test Figma — node 68:9663](https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-9663)

Design tokens (Wyze purple, Gray-C palette, semantic colors) are defined in `src/styles/tokens.css`.
