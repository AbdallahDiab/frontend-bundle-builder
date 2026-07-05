# Cursor Handoff — Step 2.1: Data & Business Logic Corrections

## Summary

Step 2.1 corrects seeded data, selected-count semantics, shipping modeling, product variants, and pricing to match the Figma screenshot. No UI, product cards, or accordion were implemented.

## What was corrected

### 1. Selected-count logic

- `getSelectedCountByStep` now counts **distinct selected lines** per step, not total quantity.
- Each product with qty > 0 counts as 1; each variant with qty > 0 counts as 1 separately.
- Added `getSelectedQuantityByStep` for total unit quantities when needed.

### 2. Fast Shipping modeling

- Removed Fast Shipping from `PRODUCT_CATALOG`.
- Added `BUNDLE_SHIPPING_SUMMARY` and `ShippingSummaryRow` type.
- Added `getShippingSummary()` selector.
- Shipping does not appear in `getSelectedItems`, does not affect selected counts, and is excluded from product savings.

### 3. Initial pricing summary

Aligned to Figma screenshot values:

| Field               | Cents | Display |
| ------------------- | ----- | ------- |
| totalCents          | 18789 | $187.89 |
| compareAtTotalCents | 23881 | $238.81 |
| savingsCents        | 5092  | $50.92  |

### 4. Product variants & pricing

| Product                   | Change                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Wyze Cam v4               | White/Grey/Black variants (unchanged); White qty 1                                 |
| Wyze Cam Pan v3           | Added White/Black variants; White qty 2, Black qty 0; unit $23.99 / compare $28.99 |
| Wyze Cam Floodlight v2    | Added White/Black variants; qty 0                                                  |
| Wyze Battery Cam Pro      | Added White/Black variants; qty 0                                                  |
| Wyze Duo Cam Doorbell     | No variants; qty 0                                                                 |
| Wyze Sense Motion Sensor  | Unit $29.99; qty 2 → line $59.98                                                   |
| Wyze Sense Hub Required   | Renamed; FREE (price 0), compare $29.92                                            |
| Wyze MicroSD Card (256GB) | Unit $20.98; qty 2 → line $41.96                                                   |
| Cam Unlimited             | Compare $12.99; suffix `/mo`                                                       |

### 5. Display fields

Added to `Product` and `SelectedItem`:

- `priceLabel` — e.g. `FREE`
- `priceSuffix` — e.g. `/mo`
- `isIncluded` — included-at-no-charge items

## Files updated

| File                            | Changes                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `src/types/bundle.ts`           | `ShippingSummaryRow`, `SelectedQuantityByStep`, display fields |
| `src/types/index.ts`            | Export new types                                               |
| `src/data/products.ts`          | Variants, pricing, hub rename, shipping removed from catalog   |
| `src/data/index.ts`             | Export `BUNDLE_SHIPPING_SUMMARY`                               |
| `src/lib/bundle/selectors.ts`   | Line-based counts, quantity helper, shipping, pricing          |
| `src/lib/bundle/index.ts`       | Export new selectors                                           |
| `src/lib/bundle/bundle.test.ts` | 17 tests covering corrections                                  |
| `src/hooks/useBundleBuilder.ts` | Expose `shippingSummary`                                       |
| `src/utils/index.ts`            | Re-export new utilities                                        |
| `README.md`                     | Selected-count, shipping, and pricing notes                    |

## Final seeded selected counts

| Step        | Distinct lines | Selected items                                    |
| ----------- | -------------- | ------------------------------------------------- |
| Cameras     | 2              | Wyze Cam v4 (White), Wyze Cam Pan v3 (White ×2)   |
| Plan        | 1              | Cam Unlimited                                     |
| Sensors     | 2              | Wyze Sense Motion Sensor, Wyze Sense Hub Required |
| Accessories | 1              | Wyze MicroSD Card (256GB)                         |

## Final pricing summary

```
Products subtotal:     $187.89 (18789 cents)
Compare-at total:      $238.81 (23881 cents)
Product savings:       $50.92  (5092 cents)
```

Line breakdown:

| Item                      | Qty | Active   | Compare-at | Savings |
| ------------------------- | --- | -------- | ---------- | ------- |
| Wyze Cam v4 (White)       | 1   | $27.98   | $35.98     | $8.00   |
| Wyze Cam Pan v3 (White)   | 2   | $47.98   | $57.98     | $10.00  |
| Wyze Sense Motion Sensor  | 2   | $59.98   | —          | —       |
| Wyze Sense Hub Required   | 1   | FREE     | $29.92     | $29.92  |
| Wyze MicroSD Card (256GB) | 2   | $41.96   | —          | —       |
| Cam Unlimited             | 1   | $9.99/mo | $12.99/mo  | $3.00   |

Shipping (separate):

| Label         | Active | Compare-at |
| ------------- | ------ | ---------- |
| Fast Shipping | FREE   | $5.99      |

## Shipping modeling

```typescript
export const BUNDLE_SHIPPING_SUMMARY: ShippingSummaryRow = {
  label: 'Fast Shipping',
  priceCents: 0,
  compareAtPriceCents: 599,
  priceLabel: 'FREE',
}
```

- Consumed via `getShippingSummary()` and `useBundleBuilder().shippingSummary`.
- Not in `PRODUCT_CATALOG`, not in `getSelectedItems`, not in accessory count.
- Shipping compare-at ($5.99) is **not** included in `savingsCents`.

## Variant corrections

- **Wyze Cam Pan v3**: White/Black with independent per-variant quantities; default White.
- **Wyze Cam Floodlight v2**: White/Black, qty 0.
- **Wyze Battery Cam Pro**: White/Black, qty 0.
- **Wyze Duo Cam Doorbell**: single SKU, no variants.

## Tests updated

**`src/lib/bundle/bundle.test.ts`** — 17 tests (was 10):

1. Seeded quantities (Pan v3 variant-based, no shipping)
2. Default active variant — Cam v4 White
3. Default active variant — Pan v3 White
4. Independent Cam v4 variant quantities
5. Switching variant preserves other quantities
6. Independent Pan v3 variant quantities
7. Decrement clamp at zero
8. Each variant with qty > 0 is a separate line
9. Six seeded products, no Fast Shipping
10. Fast Shipping not in selected items
11. Selected counts: cameras 2, plan 1, sensors 2, accessories 1
12. Shipping not counted as accessory
13. Shipping summary row available separately
14. Pricing summary: 18789 / 23881 / 5092
15. Savings excludes shipping
16. Per-line totals match Figma
17. formatCurrency for key amounts

## Commands run

```bash
npm run typecheck   # PASS
npm run lint        # PASS
npm run test        # PASS (17/17)
npm run build       # PASS
npm run format      # applied
npm run format:check # PASS
```

## Remaining assumptions

1. **Figma MCP not used** — corrections follow user-provided explicit values as source of truth.
2. **Fast Shipping** is always included (fixed summary row); no toggle in configuration state yet.
3. **Motion sensor and MicroSD** have no compare-at discount in the screenshot.
4. **Image paths** for new variant slugs (e.g. `wyze-cam-pan-v3-white.png`) are placeholders pending Step 3 asset download.
5. **Review panel UI** will consume `shippingSummary` separately from `selectedItems` and `pricingSummary`.

## Verification

| Check                                      | Status               |
| ------------------------------------------ | -------------------- |
| `npm run typecheck`                        | **PASS**             |
| `npm run lint`                             | **PASS**             |
| `npm run test`                             | **PASS** (17 tests)  |
| `npm run build`                            | **PASS**             |
| `npm run format:check`                     | **PASS**             |
| UI implemented                             | **No** (intentional) |
| Selected counts match Figma                | **Yes**              |
| Pricing matches $187.89 / $238.81 / $50.92 | **Yes**              |
| Fast Shipping not a product                | **Yes**              |
| Pan v3 variants                            | **Yes**              |

## Suggested next step (Step 3 — UI)

1. Download product/variant images from Figma.
2. Implement ProductCard with variant picker and quantity stepper.
3. Implement accordion wired to `selectedCountByStep` (distinct lines).
4. Implement ReviewPanel with `groupedSelectedItems`, `pricingSummary`, `shippingSummary`, and display helpers (`priceLabel`, `priceSuffix`).
