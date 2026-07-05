# Cursor Handoff — Step 5: Shared Bundle State + Live Review Panel

## Summary

Step 5 introduces a shared `BundleBuilderProvider` so `AccordionBuilder` and `ReviewPanel` use one bundle state instance. The right-side review panel is fully live: grouped line items, shipping row, pricing summary, satisfaction badge, and placeholder checkout/save actions.

## What changed

- Created `BundleBuilderProvider` and `useBundleBuilderContext` for shared state.
- Extended `increment` / `decrement` to accept optional `variantId` for review-panel variant lines.
- Added `incrementVariantQuantity` / `decrementVariantQuantity` pure utilities.
- Implemented `ReviewPanel` and `ReviewLineItem` replacing the placeholder.
- Wrapped `AppShell` with `BundleBuilderProvider`.
- Updated `AccordionBuilder` to consume context instead of calling `useBundleBuilder` directly.
- Added `REVIEW_CATEGORY_ORDER` for review panel section ordering (Cameras → Sensors → Accessories → Plan).
- Updated `PriceDisplay` review variant to use purple active prices.
- Added integration and ReviewPanel tests; updated AccordionBuilder tests to use provider wrapper.
- Updated README current status.

## Files created

| File                                                       | Purpose                                            |
| ---------------------------------------------------------- | -------------------------------------------------- |
| `src/components/bundle-builder/BundleBuilderProvider.tsx`  | React context provider wrapping `useBundleBuilder` |
| `src/components/bundle-builder/useBundleBuilderContext.ts` | Context + `useBundleBuilderContext` hook           |
| `src/components/review-panel/ReviewPanel.tsx`              | Live review panel UI                               |
| `src/components/review-panel/ReviewLineItem.tsx`           | Reusable review line item row                      |
| `src/components/review-panel/ReviewPanel.test.tsx`         | Review panel + shared state sync tests             |
| `src/test/renderWithBundleBuilder.tsx`                     | Test helper wrapping components with provider      |
| `CURSOR_HANDOFF_STEP_5.md`                                 | This document                                      |

## Files updated

| File                                                      | Changes                                                   |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `src/components/layout/AppShell.tsx`                      | Wraps builder + review columns in `BundleBuilderProvider` |
| `src/components/bundle-builder/AccordionBuilder.tsx`      | Uses `useBundleBuilderContext`                            |
| `src/components/bundle-builder/AccordionBuilder.test.tsx` | Uses `renderWithBundleBuilder`                            |
| `src/components/bundle-builder/index.ts`                  | Exports provider + context hook                           |
| `src/components/review-panel/ReviewPanelArea.tsx`         | Renders `ReviewPanel`                                     |
| `src/components/review-panel/index.ts`                    | Exports new components                                    |
| `src/components/common/PriceDisplay.tsx`                  | Purple active price for `review` variant                  |
| `src/hooks/useBundleBuilder.ts`                           | Optional `variantId` on increment/decrement               |
| `src/lib/bundle/quantity.ts`                              | Variant-specific increment/decrement utilities            |
| `src/lib/bundle/index.ts`                                 | Exports new quantity helpers                              |
| `src/types/bundle.ts`                                     | Added `REVIEW_CATEGORY_ORDER`                             |
| `src/types/index.ts`                                      | Re-exports `REVIEW_CATEGORY_ORDER`                        |
| `README.md`                                               | Step 5 status and architecture notes                      |

## Provider architecture summary

```
AppShell
└── BundleBuilderProvider          ← calls useBundleBuilder() once
    ├── BuilderArea
    │   └── AccordionBuilder       ← useBundleBuilderContext()
    └── ReviewPanelArea
        └── ReviewPanel            ← useBundleBuilderContext()
```

- Pure utilities in `src/lib/bundle/` remain unchanged in behavior (plus new variant quantity helpers).
- `useBundleBuilder` still owns configuration state and derived selectors.
- `BundleBuilderProvider` creates one hook instance and exposes it via React context.
- `useBundleBuilderContext()` throws if used outside the provider (fail-fast for tests and dev).

### Variant-aware quantity changes

Accordion increment/decrement continues to target the **active variant** (no `variantId` passed). Review panel passes `variantId` per line so decrementing "Wyze Cam v4 White" affects that variant directly without switching accordion active variant.

## ReviewPanel behavior summary

| Behavior          | Implementation                                                      |
| ----------------- | ------------------------------------------------------------------- |
| Title / subtitle  | "Your security system" + personalized protection copy               |
| Section order     | `REVIEW_CATEGORY_ORDER`: Cameras, Sensors, Accessories, Plan        |
| Empty sections    | Skipped — no heading rendered when group has zero items             |
| Line items        | From `groupedSelectedItems` — not hardcoded                         |
| Quantity steppers | Shared `increment` / `decrement` with optional `variantId`          |
| Item removal      | Decrement to 0 removes line from panel and updates accordion counts |
| Fast Shipping     | Separate row from `shippingSummary`, not under Accessories          |
| Sticky layout     | `lg:sticky lg:top-6 lg:self-start` on desktop                       |

### Initial selected items (seeded)

| Section     | Items                                                   |
| ----------- | ------------------------------------------------------- |
| Cameras     | Wyze Cam v4 (white ×1), Wyze Cam Pan v3 (white ×2)      |
| Sensors     | Wyze Sense Motion Sensor ×2, Wyze Sense Hub Required ×1 |
| Accessories | Wyze MicroSD Card (256GB) ×2                            |
| Plan        | Cam Unlimited ×1                                        |
| Shipping    | Fast Shipping (FREE, compare-at $5.99)                  |

## Pricing display summary

| Element          | Initial value                                 |
| ---------------- | --------------------------------------------- |
| Compare-at total | $238.81 (struck through)                      |
| Total            | $187.89                                       |
| Savings          | $50.92 ("Congrats! You're saving…")           |
| Financing pill   | Static "as low as $19.19/mo"                  |
| Line prices      | Line totals via `PriceDisplay` review variant |
| FREE items       | Wyze Sense Hub Required, Fast Shipping        |
| Plan suffix      | Cam Unlimited shows `/mo`                     |

Checkout and Save links show `window.alert` placeholders only — no real checkout or localStorage.

## Tests added/updated

| File                        | Tests                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ReviewPanel.test.tsx`      | 16 — headings, initial items, totals, savings, shipping, FREE, /mo, placeholder actions, bidirectional sync, removal, total update |
| `AccordionBuilder.test.tsx` | Updated — all 10 tests wrapped with `renderWithBundleBuilder`                                                                      |

**Total: 51 tests** (17 business logic + 34 component). All pass.

## Commands run

```bash
npm run typecheck   # PASS
npm run lint        # PASS
npm run test        # PASS (51/51)
npm run build       # PASS
npm run format:check # PASS (after npm run format)
```

## Visual fidelity notes

Aligned to `Frame 1735.png`, `Frame 8234.png`, `Frame 1736.png`, `Frame 1736 (1).png`, and `iPhone 13 & 14 - 35.png`:

- Light blue panel background (`bg-gray-200`)
- Rounded card with shadow
- Uppercase gray section headings with dividers
- Compact quantity steppers on line items
- Purple active prices, gray strikethrough compare-at
- Satisfaction guarantee badge from `satisfaction-guarantee.png`
- Purple financing pill
- Large purple total
- Green savings message
- Full-width purple Checkout button
- Underlined Save link
- Sticky right panel on large screens (~22rem column width)

Still pending: exact Gilroy typography, precise spacing tokens, final mobile polish, remaining real product images.

## Known issues

1. **13 product images still placeholders** — unchanged from prior steps.
2. **Financing pill is static** — not computed from bundle total.
3. **Checkout / Save are alert placeholders** — real flows deferred.
4. **No localStorage persistence** — intentional; next step.
5. **Final responsive polish deferred** — panel is readable when stacked but not pixel-perfect on mobile.

## Suggested next step (Step 6)

1. **localStorage persistence** — save/restore bundle configuration on "Save my system for later".
2. **Responsive polish** — refine mobile stacking, spacing, and sticky behavior.
3. **Export remaining product images** from Figma.
4. Optional: toast component instead of `window.alert` for placeholder actions.

Run `npm run dev` and compare against `src/assets/references/Frame 1735.png` and `Frame 1736.png`.
