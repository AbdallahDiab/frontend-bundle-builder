# Cursor Handoff — Step 3: Figma Assets, UI Primitives & ProductCard

## Summary

Step 3 implements reusable UI primitives, a data-driven `ProductCard` component, product/icon assets, a temporary camera showcase wired to `useBundleBuilder`, and component tests. No full accordion or review panel was built.

A follow-up pass promoted real Figma reference exports into `products/` and `icons/`, refactored `ProductCard` to the horizontal layout from `Frame 543`, and documented the full `references/` inventory.

## What changed

- Added product PNGs (5 real from references + 13 placeholders) and SVG/PNG icon assets.
- Created reusable UI primitives under `src/components/common/`.
- Implemented `ProductCard` driven entirely by `Product` data and parent-passed state.
- **Horizontal card layout** — image left (~38%), content right; matches `Frame 543` / `Frame 8234`.
- Replaced `BuilderArea` placeholder with temporary `CameraProductShowcase` (Step 3 only).
- Added `src/lib/productDisplay.ts` for pricing/image resolution helpers.
- Configured Vitest with `jsdom` and React Testing Library.
- Promoted 5 product photos + satisfaction badge from `src/assets/references/`.
- Updated README status and asset documentation.

## Figma inspection note

Figma MCP was **rate-limited** during the initial Step 3 pass. Visual styling follows design tokens from `src/styles/tokens.css` and **local Figma reference exports** in `src/assets/references/`. Five isolated product photos and the satisfaction badge were promoted from references; remaining catalog images are still placeholders.

When MCP access is restored, export remaining product images via `download_assets` for node `1:858` and replace files in `src/assets/products/` without changing catalog paths.

## Assets

### Product images (`src/assets/products/`)

| File                               | Status      | Source                         |
| ---------------------------------- | ----------- | ------------------------------ |
| `wyze-cam-v4.png`                  | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-v4-white.png`            | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-v4-grey.png`             | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-v4-black.png`            | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-pan-v3.png`              | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-pan-v3-white.png`        | **Real**    | `references/image 13 (1).png`  |
| `wyze-cam-pan-v3-black.png`        | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-floodlight-v2.png`       | Placeholder | `generate-placeholders.mjs`    |
| `wyze-cam-floodlight-v2-white.png` | **Real**    | `references/image 16.png`      |
| `wyze-cam-floodlight-v2-black.png` | Placeholder | `generate-placeholders.mjs`    |
| `wyze-duo-cam-doorbell.png`        | **Real**    | `references/image 110 (1).png` |
| `wyze-battery-cam-pro.png`         | Placeholder | `generate-placeholders.mjs`    |
| `wyze-battery-cam-pro-white.png`   | **Real**    | `references/image 112.png`     |
| `wyze-battery-cam-pro-black.png`   | **Real**    | `references/image 112 (1).png` |
| `wyze-sense-motion-sensor.png`     | Placeholder | `generate-placeholders.mjs`    |
| `wyze-sense-hub.png`               | Placeholder | `generate-placeholders.mjs`    |
| `wyze-microsd-card-256gb.png`      | Placeholder | `generate-placeholders.mjs`    |
| `cam-unlimited.png`                | Placeholder | `generate-placeholders.mjs`    |

**5 of 18** product images are real Figma exports. Pan v3 white includes 360°/180° motion overlay from the reference.

### Icons (`src/assets/icons/`)

| File                              | Purpose                | Status                                                   |
| --------------------------------- | ---------------------- | -------------------------------------------------------- |
| `camera-step.svg`                 | Cameras accordion step | Local SVG                                                |
| `shield-plan-step.svg`            | Plan step              | Local SVG                                                |
| `sensors-step.svg`                | Sensors step           | Local SVG                                                |
| `protection-accessories-step.svg` | Accessories step       | Local SVG                                                |
| `chevron-up.svg`                  | Accordion collapse     | Local SVG                                                |
| `chevron-down.svg`                | Accordion expand       | Local SVG                                                |
| `plus.svg`                        | Quantity increment     | Local SVG                                                |
| `minus.svg`                       | Quantity decrement     | Local SVG                                                |
| `shipping-truck.svg`              | Fast shipping row      | Local SVG                                                |
| `satisfaction-guarantee.png`      | Guarantee badge        | **Real** — from `references/Satisfaction Badge-05 1.png` |

Step icons remain hand-authored SVG approximations.

### References (`src/assets/references/`)

Figma design exports kept as visual source-of-truth. **Do not delete** — used for Step 4+ layout work.

#### Full-page layouts

| File                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `Frame 1735.png`          | Desktop — accordion + review panel side-by-side  |
| `Frame 8234.png`          | Step 1 cameras accordion (5 cards + Next button) |
| `Frame 1736.png`          | Mobile — accordion steps + review summary        |
| `Frame 1736 (1).png`      | Mobile review panel only                         |
| `iPhone 13 & 14 - 35.png` | Mobile full flow                                 |

#### Per-product card mocks (layout reference)

| File            | Product                                                |
| --------------- | ------------------------------------------------------ |
| `Frame 543.png` | Wyze Cam v4 — **primary ProductCard layout reference** |
| `Frame 544.png` | Wyze Cam Floodlight v2                                 |
| `Frame 545.png` | Wyze Cam Pan v3                                        |
| `Frame 546.png` | Wyze Duo Cam Doorbell                                  |
| `Frame 547.png` | Wyze Battery Cam Pro                                   |

#### Isolated raster assets (promoted → `products/` or `icons/`)

| Reference file                | Promoted to                                 |
| ----------------------------- | ------------------------------------------- |
| `image 13 (1).png`            | `products/wyze-cam-pan-v3-white.png`        |
| `image 16.png`                | `products/wyze-cam-floodlight-v2-white.png` |
| `image 110 (1).png`           | `products/wyze-duo-cam-doorbell.png`        |
| `image 112.png`               | `products/wyze-battery-cam-pro-white.png`   |
| `image 112 (1).png`           | `products/wyze-battery-cam-pro-black.png`   |
| `Satisfaction Badge-05 1.png` | `icons/satisfaction-guarantee.png`          |

#### Still missing from references (need Figma export or crop)

- Wyze Cam v4 (+ white/grey/black variants)
- Pan v3 black, Floodlight v2 black
- Sensors, hub, MicroSD, Cam Unlimited

## Components added

### UI primitives (`src/components/common/`)

| Component         | Purpose                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `QuantityStepper` | Controlled +/- stepper; decrement disabled at 0                                                 |
| `PriceDisplay`    | Active price, compare-at strikethrough, `priceLabel`, `priceSuffix`; `card` / `review` variants |
| `DiscountBadge`   | Purple pill badge (e.g. "Save 22%")                                                             |
| `VariantSelector` | Variant chips with thumbnail + label; teal border when active                                   |
| `ProductImage`    | Lazy-loaded product image with object-contain                                                   |
| `AppButton`       | Ghost, outline, and icon button variants                                                        |
| `VisuallyHidden`  | Screen-reader-only content                                                                      |

### Bundle builder (`src/components/bundle-builder/`)

| Component               | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `ProductCard`           | Horizontal product card UI                          |
| `CameraProductShowcase` | **Temporary** Step 3 vertical stack of camera cards |
| `BuilderArea`           | Now renders `CameraProductShowcase`                 |

## ProductCard API

```typescript
type ProductCardProps = {
  product: Product
  activeVariantId?: VariantId
  quantity: number
  onVariantChange: (variantId: VariantId) => void
  onIncrement: () => void
  onDecrement: () => void
  className?: string
}
```

### Behavior

- **Data-driven** — no product-specific hardcoding.
- **Does not read global state** — parent passes quantity, variant, and handlers.
- **Selected state** — `data-selected="true"` when `quantity > 0` for the active line (active variant qty for variant products, product qty otherwise).
- **Pricing/image** — resolved via `getProductDisplayPricing(product, activeVariantId)`.
- **Variants** — `VariantSelector` rendered only when `product.variants` is non-empty.
- **Layout** — horizontal on `sm+` (image left ~38%, content right); stacks vertically on narrow viewports.
- **Visual** — white card, `rounded-card`, purple border + `selection-bg` when selected; purple discount badge; teal active variant chip border; price bottom-right with red compare-at strikethrough.

## Files created

| File                                                      | Purpose                                    |
| --------------------------------------------------------- | ------------------------------------------ |
| `scripts/generate-placeholders.mjs`                       | Generates placeholder product PNGs         |
| `src/assets/products/*.png`                               | 18 product images (5 real, 13 placeholder) |
| `src/assets/icons/*`                                      | 9 SVG icons + 1 PNG guarantee badge        |
| `src/assets/references/*`                                 | 16 Figma reference exports                 |
| `src/components/common/AppButton.tsx`                     | Button primitive                           |
| `src/components/common/VisuallyHidden.tsx`                | A11y helper                                |
| `src/components/common/QuantityStepper.tsx`               | Quantity control                           |
| `src/components/common/PriceDisplay.tsx`                  | Price formatting display                   |
| `src/components/common/DiscountBadge.tsx`                 | Sale badge                                 |
| `src/components/common/VariantSelector.tsx`               | Color/variant picker                       |
| `src/components/common/ProductImage.tsx`                  | Image wrapper                              |
| `src/components/common/QuantityStepper.test.tsx`          | Component tests                            |
| `src/components/bundle-builder/ProductCard.tsx`           | Product card                               |
| `src/components/bundle-builder/ProductCard.test.tsx`      | Component tests                            |
| `src/components/bundle-builder/CameraProductShowcase.tsx` | Temporary showcase                         |
| `src/lib/productDisplay.ts`                               | Display pricing helpers                    |
| `src/test/setup.ts`                                       | Vitest + RTL + cleanup                     |
| `CURSOR_HANDOFF_STEP_3.md`                                | This document                              |

## Files updated (follow-up pass)

| File                                                      | Changes                                        |
| --------------------------------------------------------- | ---------------------------------------------- |
| `src/components/bundle-builder/ProductCard.tsx`           | Horizontal layout per `Frame 543`              |
| `src/components/common/DiscountBadge.tsx`                 | Purple badge (`bg-wyze-purple`)                |
| `src/components/common/VariantSelector.tsx`               | Teal active border (`border-selection`)        |
| `src/components/bundle-builder/CameraProductShowcase.tsx` | Vertical card stack (matches Step 1 accordion) |
| `src/assets/products/`                                    | 5 real images promoted from references         |
| `src/assets/icons/satisfaction-guarantee.png`             | Real badge; removed placeholder SVG            |
| `README.md`                                               | Asset and layout notes                         |
| `CURSOR_HANDOFF_STEP_3.md`                                | References inventory + promoted assets         |

## Tests added

| File                                                 | Tests                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/components/common/QuantityStepper.test.tsx`     | 3 — decrement disabled at 0, enabled above 0, handler calls                                         |
| `src/components/bundle-builder/ProductCard.test.tsx` | 5 — variants render, no variants skip selector, increment/decrement, variant change, selected state |

**Total: 25 tests** (17 business logic + 8 component). All pass.

## Commands run

```bash
node scripts/generate-placeholders.mjs
# Promote reference assets (PowerShell)
Copy-Item "src/assets/references/image 13 (1).png" "src/assets/products/wyze-cam-pan-v3-white.png"
Copy-Item "src/assets/references/image 16.png" "src/assets/products/wyze-cam-floodlight-v2-white.png"
Copy-Item "src/assets/references/image 110 (1).png" "src/assets/products/wyze-duo-cam-doorbell.png"
Copy-Item "src/assets/references/image 112.png" "src/assets/products/wyze-battery-cam-pro-white.png"
Copy-Item "src/assets/references/image 112 (1).png" "src/assets/products/wyze-battery-cam-pro-black.png"
Copy-Item "src/assets/references/Satisfaction Badge-05 1.png" "src/assets/icons/satisfaction-guarantee.png"
npm run typecheck   # PASS
npm run lint        # PASS
npm run test        # PASS (25/25)
npm run build       # PASS
npm run format:check # PASS
```

## Assumptions

1. **Figma MCP unavailable** for bulk export — references folder used as manual export source.
2. **Pan v3 white image** retains 360°/180° overlay from reference (acceptable for now).
3. **Gilroy font** — not bundled; falls back to system-ui stack from tokens.
4. **Selected card state** — tied to **active variant** quantity, not total quantity across variants.
5. **Showcase layout** — vertical card stack matches `Frame 8234` Step 1 accordion, not a multi-column grid.

## Visual fidelity notes

Aligned to `Frame 543` / `Frame 8234` references:

- **Horizontal card** — image left, content right on `sm+`
- **Selected** — `border-wyze-purple-border`, `bg-selection-bg`
- **Discount badge** — purple pill (`bg-wyze-purple`)
- **Active variant chip** — teal border (`border-selection`)
- **Compare-at** — red strikethrough on cards
- **Showcase** — single-column stack of full-width cards

Still pending: Wyze Cam v4 product photos, exact typography (Gilroy), precise spacing tokens.

## Known issues

1. **13 product images still placeholders** — Cam v4 variants, Pan v3 black, Floodlight black, non-camera products.
2. **Pan v3 white** includes motion diagram overlay from reference export.
3. **Step icons** — SVG approximations, not Figma vector exports.
4. **Satisfaction badge** — PNG only; not yet used in ReviewPanel (Step 4).

## Verification

| Check                           | Status               |
| ------------------------------- | -------------------- |
| `npm run typecheck`             | **PASS**             |
| `npm run lint`                  | **PASS**             |
| `npm run test`                  | **PASS** (25 tests)  |
| `npm run build`                 | **PASS**             |
| `npm run format:check`          | **PASS**             |
| ProductCard horizontal layout   | **Yes**              |
| 5 real product images promoted  | **Yes**              |
| References inventory documented | **Yes**              |
| Full accordion                  | **No** (intentional) |
| Full review panel               | **No** (intentional) |

## Suggested next step (Step 4)

1. **Export remaining product images** from Figma (especially Cam v4 variants).
2. **Implement AccordionBuilder** using `BUNDLE_STEPS`, step icons, and `selectedCountByStep`.
3. **Replace `CameraProductShowcase`** with per-step accordion panels rendering `ProductCard`.
4. **Implement ReviewPanel** using `groupedSelectedItems`, `pricingSummary`, `shippingSummary`, and `satisfaction-guarantee.png`.
5. **Wire step navigation** (Next buttons from `bundleSteps.ts`).

Run `npm run dev` and compare against `src/assets/references/Frame 8234.png`.
