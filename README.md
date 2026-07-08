# Security Bundle Builder

A responsive React + TypeScript prototype for configuring a personalized Wyze security system. Users select cameras, a plan, sensors, and accessories in a multi-step accordion, with a live review panel for pricing and checkout actions.

**Live demo:** Not deployed yet. Run locally with `npm run dev`.

## Tech stack

- React 19 + TypeScript (strict mode)
- Vite
- Tailwind CSS v4 with Figma-derived design tokens
- Vitest + React Testing Library
- ESLint + Prettier

## Features implemented

- Four-step accordion builder (cameras → plan → sensors → extra protection)
- Step 1 open by default; steps toggle open/close; Next advances to the next step
- Data-driven product cards (badge, image, title, description, Learn More, variants, quantity stepper, pricing, selected state)
- Per-variant independent quantities with review lines per selected variant
- Live review panel synced with the builder (Cameras, Sensors, Accessories, Plan)
- Shipping row, satisfaction badge, financing line, totals, savings, checkout, and save link when the cart has items
- Empty review state without shipping / badge / financing / savings; checkout disabled
- Totals derived from catalog cents via pricing utilities (`formatCurrency`)
- Save / restore configuration with versioned `localStorage`
- Responsive two-column desktop layout and single-column mobile layout
- Accessible accordion, steppers, variant radios, and toast live region

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

```
src/
  app/                 # App composition
  assets/              # Product images, icons, bundling helpers
  components/
    common/            # QuantityStepper, PriceDisplay, Toast, VariantSelector, …
    layout/            # App shell and responsive container
    bundle-builder/    # AccordionBuilder, ProductCard, shared provider
    review-panel/      # ReviewPanel and line items
  data/                # Product catalog and bundle steps
  hooks/               # useBundleBuilder state hook
  lib/bundle/          # Pure quantity, pricing, persistence utilities
  lib/productDisplay.ts
  styles/              # Global styles and design tokens
  test/                # Vitest setup and render helpers
  types/               # Shared TypeScript types
  utils/               # formatCurrency helper
```

**Data flow:** `PRODUCT_CATALOG` and `BUNDLE_STEPS` define selectable content. `useBundleBuilder` owns `BundleConfiguration` (quantities + active variants). Pure helpers in `src/lib/bundle/` derive selected items, review groups, pricing, and step counts. `BundleBuilderProvider` shares one hook instance between the accordion and review panel.

## Data-driven catalog

Products, variants, prices, badges, images, and seeded quantities live in `src/data/products.ts`. Step metadata lives in `src/data/bundleSteps.ts`. Components render from those types; there are no product-specific UI branches for individual SKUs.

All monetary values are stored as **integer cents** (for example `2798` = `$27.98`). Display uses `formatCurrency()` from `src/utils/formatCurrency.ts`. UI totals are never hardcoded.

Product images are imported through `src/assets/productAssets.ts` so Vite includes them in production builds.

## Variant quantity behavior

- Products with variants track quantity **per variant**, independently.
- The active variant controls which quantity the card stepper adjusts.
- Switching active variant does not reset other variant quantities.
- The review panel lists each variant with quantity > 0 as its own line item.
- Products without variants have no selector and use a single product-level quantity.

## Selected counters vs quantity

Accordion step counters count **distinct selected lines** — one per product or per variant with quantity > 0. Raising quantity on a line does not increase the selected count (for example Cam Pan v3 at qty 2 still counts as 1 camera line).

## Review panel sync

`AccordionBuilder` and `ReviewPanel` both consume `useBundleBuilderContext()`. Quantity changes in either surface call the same `increment` / `decrement` handlers, so line items, totals, and step counts stay in sync without duplicated state.

## Persistence

Configuration is saved under **`bundle-builder-config-v1`**.

| Stored                | Not stored                                |
| --------------------- | ----------------------------------------- |
| `quantities.products` | Selected items / grouped review data      |
| `quantities.variants` | Pricing totals and savings                |
| `activeVariants`      | Shipping summary and other derived values |

**Save:** “Save my system for later” writes the current configuration. There is no auto-save on every change.

**Restore:** On load, `loadBundleConfiguration()` restores a valid payload. Missing/invalid JSON, unknown product or variant ids, or malformed shapes fall back to seeded defaults without crashing.

### Reset saved demo state

A previous visit may restore a different configuration than the seeded defaults. Reset in the browser console:

```js
localStorage.removeItem('bundle-builder-config-v1')
location.reload()
```

### Clean default state

With empty `localStorage`, the seeded catalog currently produces:

| Field            | Value   |
| ---------------- | ------- |
| Total            | $209.87 |
| Compare-at total | $260.79 |
| Savings          | $50.92  |

| Step                 | Selected count |
| -------------------- | -------------- |
| Cameras              | 2              |
| Plan                 | 1              |
| Sensors              | 2              |
| Add extra protection | 1              |

These figures come from catalog prices × seeded quantities, not hardcoded UI constants. If catalog data changes, totals update automatically.

## Accessibility

- Accordion headers are `button` elements with `aria-expanded` and `aria-controls`.
- Quantity steppers are keyboard-operable buttons with descriptive labels.
- Variant selectors use a `radiogroup` with labeled radio buttons.
- Toasts use `aria-live="polite"` and dismissible `role="status"` messages.
- Focus-visible outlines are applied to interactive controls.
- Enabled controls use `cursor-pointer`; disabled controls use `cursor-not-allowed`.
- Learn More links are real anchors that open product pages in a new tab.

## Responsive behavior

Desktop content width matches the Figma layout tokens:

- Builder: `768px`
- Gap: `29px`
- Review panel: `399px`
- Total content: `1196px`

| Viewport        | Layout                                                |
| --------------- | ----------------------------------------------------- |
| < `xl` (1280px) | Single column — builder first, review panel below     |
| `xl` and up     | Two columns — builder left, sticky review panel right |

“Let's get started!” renders as an `<h1>` on mobile/tablet only.

Toasts appear at the top on mobile and bottom-center on larger screens so they do not cover checkout/save actions.

## Tradeoffs and assumptions

- Some catalog images are simplified exports or placeholders where higher-resolution assets were unavailable; paths remain drop-in replaceable via `productAssets.ts`.
- The financing pill (“as low as $19.19/mo”) is static copy, not computed from the bundle total.
- Checkout shows prototype toast feedback only; there is no payment flow.
- Gilroy / TT Norms Pro fall back to system sans-serif unless those fonts are loaded separately.
- Shipping is a fixed summary row, not a selectable catalog product.
- Odd product grids center the last card on desktop with CSS; exact pixel parity is not guaranteed at every breakpoint.

## What could be improved with more time

- Replace remaining placeholder product images with final exported assets.
- Add visual regression / integration coverage at the target breakpoints (1440, 1280, 1024, 768, 390, 375).
- Derive financing messaging from the live bundle total.
- Support URL-based deep linking for saved bundles.
- Add error boundaries around persistence failures.
- Polish accordion expand/collapse and toast enter/exit motion.

## Design reference

Figma: [Frontend Test Figma — node 68:9663](https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-9663)

Design tokens (Wyze purple, Gray-C palette, semantic colors, layout widths) are defined in `src/styles/tokens.css`.
