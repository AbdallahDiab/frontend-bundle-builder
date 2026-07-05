# Cursor Handoff — Step 2: Domain Model & Business Logic

## Summary

Step 2 adds a production-quality **data-driven foundation** for the Security Bundle Builder: typed domain models, a seeded product catalog, pure bundle state utilities, a `useBundleBuilder` hook shell, and Vitest unit tests. No product cards, accordion UI, or review panel UI were implemented.

## What changed

- Expanded `src/types/bundle.ts` with full domain types for steps, products, variants, configuration, selected items, and pricing.
- Created a typed product catalog with Figma-aligned seeded quantities and Wyze Cam v4 variant support.
- Defined four builder steps in `src/data/bundleSteps.ts`.
- Implemented pure bundle utilities in `src/lib/bundle/` for quantity management, selection, grouping, and pricing.
- Added `useBundleBuilder` hook exposing configuration, derived data, and handlers.
- Updated `formatCurrency` to accept **cents** (integer) instead of dollars.
- Installed and configured **Vitest** with 10 unit tests covering core business rules.
- Updated README with architecture documentation.

## Figma inspection note

Figma MCP was **rate-limited** during this step (Organization plan View seat limit). Pricing and product data were derived from:

1. **Step 1 inspection** — Wyze Cam v4: $35.98 compare-at / $27.98 sale, "Save 22%", White/Grey/Black variants.
2. **User requirements** — Seeded review panel items and initial quantities.
3. **Wyze retail alignment** — Other product prices aligned with typical Wyze bundle builder values where Figma values were unavailable.

Verify non–Cam v4 prices against the full Figma file when MCP access is restored.

## Data model summary

| Type                        | Purpose                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| `BundleStep`                | Builder accordion step metadata (id, number, title, icon, category)    |
| `Product`                   | Catalog item with optional variants, pricing, badges, initial quantity |
| `ProductVariant`            | Color/SKU variant with independent price and initial quantity          |
| `ProductCategory`           | `cameras` \| `plan` \| `sensors` \| `accessories`                      |
| `BundleConfiguration`       | Runtime state: `activeVariants` + `quantities`                         |
| `QuantityMap`               | Product-level and variant-level quantity maps                          |
| `SelectedItem` / `CartItem` | Review panel line item with pricing breakdown                          |
| `PricingSummary`            | `subtotalCents`, `compareAtTotalCents`, `savingsCents`, `totalCents`   |
| `GroupedSelectedItems`      | Selected items keyed by category for review panel sections             |
| `SelectedCountByStep`       | Total quantity per builder step                                        |

## Initial seeded products and quantities

| Product                   | Qty | Notes                                   |
| ------------------------- | --- | --------------------------------------- |
| Wyze Cam v4 (White)       | 1   | Variant product; default active variant |
| Wyze Cam Pan v3           | 2   | Non-variant product                     |
| Wyze Sense Motion Sensor  | 2   |                                         |
| Wyze Sense Hub            | 1   | Marked required                         |
| Wyze MicroSD Card (256GB) | 2   |                                         |
| Cam Unlimited             | 1   |                                         |
| Fast Shipping             | 1   |                                         |

### Builder catalog (cameras step, qty 0 initially)

- Wyze Cam Floodlight v2
- Wyze Duo Cam Doorbell
- Wyze Battery Cam Pro

### Initial pricing summary (computed)

| Field            | Value                 |
| ---------------- | --------------------- |
| Subtotal         | $235.84 (23584 cents) |
| Compare-at total | $277.72 (27772 cents) |
| Savings          | $41.88 (4188 cents)   |
| Total            | $235.84               |

### Selected count by step

| Step        | Count |
| ----------- | ----- |
| Cameras     | 3     |
| Plan        | 1     |
| Sensors     | 3     |
| Accessories | 3     |

## Utility functions added

Located in `src/lib/bundle/` (re-exported from `src/lib/index.ts` and `src/utils/index.ts`):

| Function                        | File                      | Purpose                                     |
| ------------------------------- | ------------------------- | ------------------------------------------- |
| `getInitialBundleConfiguration` | `initialState.ts`         | Build seeded state from catalog             |
| `getProductQuantity`            | `quantity.ts`             | Total qty for a product (sums variants)     |
| `getVariantQuantity`            | `quantity.ts`             | Qty for a specific variant                  |
| `incrementItemQuantity`         | `quantity.ts`             | +1 on active variant or product             |
| `decrementItemQuantity`         | `quantity.ts`             | -1, clamped at 0                            |
| `setActiveVariant`              | `quantity.ts`             | Switch active variant without resetting qty |
| `getSelectedItems`              | `selectors.ts`            | Flat list of line items with qty > 0        |
| `getSelectedCountByStep`        | `selectors.ts`            | Sum quantities per builder step             |
| `groupSelectedItemsByCategory`  | `selectors.ts`            | Group for review panel sections             |
| `calculatePricingSummary`       | `selectors.ts`            | Subtotal, savings, total in cents           |
| `formatCurrency`                | `utils/formatCurrency.ts` | Display helper (cents → USD string)         |

## Hook added

**`src/hooks/useBundleBuilder.ts`** exposes:

- `configuration` — current `BundleConfiguration`
- `selectedItems` — derived flat list
- `groupedSelectedItems` — derived by category
- `pricingSummary` — derived pricing
- `selectedCountByStep` — derived step counts
- `increment(productId)` / `decrement(productId)` / `selectVariant(productId, variantId)`

## Tests added

**`src/lib/bundle/bundle.test.ts`** — 10 tests:

1. Seeded initial quantities match catalog
2. Default active variant is White for Wyze Cam v4
3. Independent variant quantities
4. Switching active variant preserves other variant quantities
5. Decrement never goes below zero
6. Each variant with qty > 0 appears as separate review line
7. All 7 seeded review panel products present
8. Selected count by step is correct
9. Pricing summary calculation is correct
10. `formatCurrency` formats cents as USD

## Files created

| File                             | Purpose                       |
| -------------------------------- | ----------------------------- |
| `src/data/bundleSteps.ts`        | Four builder steps            |
| `src/lib/bundle/initialState.ts` | Initial configuration builder |
| `src/lib/bundle/quantity.ts`     | Quantity mutations and reads  |
| `src/lib/bundle/selectors.ts`    | Selection, grouping, pricing  |
| `src/lib/bundle/index.ts`        | Barrel export                 |
| `src/lib/bundle/bundle.test.ts`  | Unit tests                    |
| `src/hooks/useBundleBuilder.ts`  | React hook shell              |
| `CURSOR_HANDOFF_STEP_2.md`       | This document                 |

## Files updated

| File                          | Changes                                   |
| ----------------------------- | ----------------------------------------- |
| `src/types/bundle.ts`         | Full domain type definitions              |
| `src/types/index.ts`          | Export all types                          |
| `src/data/products.ts`        | Complete typed catalog                    |
| `src/data/index.ts`           | Export catalog and steps                  |
| `src/utils/formatCurrency.ts` | Accept cents instead of dollars           |
| `src/utils/index.ts`          | Re-export bundle utilities                |
| `src/lib/index.ts`            | Re-export bundle module                   |
| `src/hooks/index.ts`          | Export `useBundleBuilder`                 |
| `vite.config.ts`              | Vitest config                             |
| `tsconfig.app.json`           | Vitest types                              |
| `package.json`                | `test`, `test:watch` scripts + vitest dep |
| `README.md`                   | Architecture docs and status update       |

## Packages installed

- `vitest` (dev)

## Commands run

```bash
npm install -D vitest
npm run typecheck   # PASS
npm run lint        # PASS
npm run test        # PASS (10/10)
npm run build       # PASS
npm run format:check # PASS
```

## Assumptions

1. **Figma MCP unavailable** — Only Wyze Cam v4 pricing was confirmed from Step 1 Figma inspection. Other prices use Wyze retail–aligned values; update when full Figma access is available.
2. **Wyze Cam Pan v3** is modeled as a **non-variant** product with product-level quantity (qty 2).
3. **Fast Shipping** priced at $9.99 (999 cents) as an accessory line item.
4. **Cam Unlimited** priced at $9.99/mo (999 cents) as a single plan line.
5. **Image paths** use `/src/assets/products/{slug}.png` placeholders; files are not yet downloaded.
6. **Review panel grouping** uses `ProductCategory` → Cameras, Plan, Sensors, Accessories labels from `REVIEW_CATEGORY_LABELS`.

## Missing assets

All product images referenced in `src/data/products.ts` are **placeholder paths** without actual files:

- `wyze-cam-v4.png`, `wyze-cam-v4-white.png`, `wyze-cam-v4-grey.png`, `wyze-cam-v4-black.png`
- `wyze-cam-pan-v3.png`
- `wyze-cam-floodlight-v2.png`
- `wyze-duo-cam-doorbell.png`
- `wyze-battery-cam-pro.png`
- `wyze-sense-motion-sensor.png`
- `wyze-sense-hub.png`
- `wyze-microsd-card-256gb.png`
- `cam-unlimited.png`
- `fast-shipping.png`

Download from Figma MCP (`download_assets`) in Step 3 and place in `src/assets/products/`.

## Verification

| Check                    | Status               |
| ------------------------ | -------------------- |
| `npm run typecheck`      | **PASS**             |
| `npm run lint`           | **PASS**             |
| `npm run test`           | **PASS** (10 tests)  |
| `npm run build`          | **PASS**             |
| `npm run format:check`   | **PASS**             |
| UI beyond placeholders   | **No** (intentional) |
| Product data fully typed | **Yes**              |
| Variant logic            | **Yes**              |
| Cents-based pricing      | **Yes**              |

## Suggested next step (Step 3)

1. **Download product images** from Figma into `src/assets/products/`.
2. **Implement ProductCard** component from Figma node `1:858` (variants, quantity stepper, pricing, badge).
3. **Implement accordion builder UI** wired to `BUNDLE_STEPS` and `useBundleBuilder`.
4. **Implement ReviewPanel** using `groupedSelectedItems`, `pricingSummary`, and `formatCurrency`.
5. **Wire AppShell** to replace placeholder panels with real components.

Run `npm run test:watch` during UI development to guard business logic regressions.
