# Cursor Handoff — Step 7: Responsive Polish + Visual Fidelity

## Summary

Step 7 is a visual/responsive pass only — no architecture or business-logic changes. The layout, product cards, and review panel were refined against local Figma reference screenshots (`Frame 1735`, `Frame 8234`, `Frame 1736`, `Frame 1736 (1)`, `iPhone 13 & 14 - 35`). Persistence, accordion behavior, and shared bundle state are unchanged.

## What changed

- Tuned design tokens for page background, review panel surface, accordion open state, content max-width, and review column width.
- Adjusted `AppShell` / `MainContainer` grid proportions, gaps, and page background.
- Hid "Let's get started!" on desktop (`lg:hidden`); kept as mobile `<h1>` per iPhone reference.
- Refined accordion open/closed surfaces, product grid spacing, odd-count card centering, and Next button placement.
- Polished `ProductCard` compact layout — borders, image sizing, text truncation, stepper/price alignment.
- Polished `ReviewPanel` — REVIEW label, sticky scroll, footer layout (badge, financing pill, totals, savings, checkout, save).
- Improved `ReviewLineItem` spacing, thumbnails, and price column width on narrow screens.
- Enlarged quantity stepper tap targets (`min-h-9 min-w-9`).
- Moved toast to top on mobile; bottom-center on `sm+` to avoid covering checkout/save.
- Added accordion heading visibility test; updated review panel title test for REVIEW label.
- Updated README with Step 7 status, responsive docs, localStorage reset command, and known limitations.

## Files updated

| File                                                      | Changes                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/styles/tokens.css`                                   | Page/review/accordion surface tokens, layout widths, card shadow     |
| `src/styles/globals.css`                                  | Page background token, `overflow-x: hidden` on body                  |
| `src/components/layout/AppShell.tsx`                      | Page bg, two-column grid at `lg`, review column width token          |
| `src/components/layout/MainContainer.tsx`                 | Max content width, responsive shell padding                          |
| `src/components/bundle-builder/AccordionBuilder.tsx`      | Mobile-only heading, accordion surfaces, grid centering, Next button |
| `src/components/bundle-builder/ProductCard.tsx`           | Compact card borders, image/text/stepper/price polish                |
| `src/components/review-panel/ReviewPanel.tsx`             | REVIEW label, sticky panel, footer layout, compare-at test id        |
| `src/components/review-panel/ReviewLineItem.tsx`          | Thumbnail/stepper/price spacing, truncate names                      |
| `src/components/common/QuantityStepper.tsx`               | Larger tap targets                                                   |
| `src/components/common/VariantSelector.tsx`               | Slightly tighter compact variant pills                               |
| `src/components/common/Toast.tsx`                         | Top placement on mobile, bottom on `sm+`                             |
| `src/components/bundle-builder/AccordionBuilder.test.tsx` | Mobile heading visibility test                                       |
| `src/components/review-panel/ReviewPanel.test.tsx`        | REVIEW label assertion                                               |
| `README.md`                                               | Step 7 status, responsive docs, reset command, limitations           |

## Files created

| File                       | Purpose       |
| -------------------------- | ------------- |
| `CURSOR_HANDOFF_STEP_7.md` | This document |

## Desktop fidelity improvements

Compared against `Frame 1735.png` and `Frame 8234.png`:

| Area                 | Improvement                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Page background      | `--color-page-bg` (#e6ebf0) separates from white accordion and review panel              |
| Column layout        | Builder flexes; review panel fixed at `20.5rem` from `lg` breakpoint                     |
| Column gap           | `gap-10` / `gap-12` at `lg` / `xl`                                                       |
| Content width        | `max-w-[75rem]` centered container                                                       |
| Desktop heading      | "Let's get started!" hidden at `lg+`                                                     |
| Accordion open panel | Light muted surface on header row; white product area below divider                      |
| Product grid         | 2-column grid with centered last card when count is odd                                  |
| Product cards        | Solid purple selected border; subtle gray unselected border; compact image column        |
| Next button          | Centered, outlined purple, wider min-width                                               |
| Review panel         | Distinct `bg-review-panel`, REVIEW caps label, sticky with max-height scroll             |
| Review footer        | Badge left, financing pill + totals right-aligned; savings centered; full-width checkout |

## Mobile / responsive improvements

Compared against `Frame 1736.png` and `iPhone 13 & 14 - 35.png`:

| Area              | Improvement                                                   |
| ----------------- | ------------------------------------------------------------- |
| Layout            | Single column below `lg`; builder first, review below         |
| Heading           | Centered "Let's get started!" `<h1>` visible below `lg`       |
| Horizontal scroll | `overflow-x: hidden` on body; truncated product/review names  |
| Product cards     | Single column grid; vertical stack on narrow viewports        |
| Review panel      | Full width, readable line items, fixed price column width     |
| Stepper taps      | `min-h-9 min-w-9` buttons                                     |
| Checkout          | Full-width button with `min-h-11`                             |
| Save link         | Centered below checkout                                       |
| Toast             | Top of viewport on mobile so it does not cover footer actions |

## Accessibility improvements

- Mobile builder title promoted to `<h1>`; review title remains `<h2>`.
- Accordion step headers remain `<h3>` with button controls and valid `aria-expanded` / `aria-controls`.
- Focus-visible outlines preserved on accordion headers, Next, checkout, save, variant radios, and steppers.
- Toast retains `aria-live="polite"`, `role="status"`, and dismiss button with accessible name.
- No new clickable divs introduced; all interactions remain on buttons/links.
- Product card names use `truncate`; descriptions use `line-clamp-2` to prevent overflow.

## Tests added / updated

| File                        | Change                                                        |
| --------------------------- | ------------------------------------------------------------- |
| `AccordionBuilder.test.tsx` | +1 — mobile heading renders as `h1` inside `lg:hidden` header |
| `ReviewPanel.test.tsx`      | Updated title test to assert REVIEW label                     |

**All existing tests retained.** No persistence or quantity-sync tests removed.

## Commands run

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run format:check
```

## Visual notes against Figma references

| Reference           | Match notes                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| Frame 1735          | Two-column desktop, sticky review sidebar, muted page bg, no mobile heading     |
| Frame 8234          | Accordion step styling, 2-col product grid, centered odd card, Next button      |
| Frame 1736 (1)      | REVIEW label, review panel tint, line item layout, footer badge/totals/checkout |
| Frame 1736          | Stacked mobile builder + review                                                 |
| iPhone 13 & 14 - 35 | Mobile heading, single column, full-width checkout, save link visible           |

## Known remaining issues

1. **13 product images still placeholders** — unchanged; limits card/review thumbnail fidelity.
2. **Financing pill static** — "as low as $19.19/mo" not computed from total.
3. **Gilroy font not bundled** — system fallback unless added later.
4. **Pixel-perfect parity** — spacing approximated via Tailwind tokens; not measured against Figma px values.
5. **Review panel scroll** — sticky + internal scroll on very short viewports may clip footer until scrolled.

## Suggested next step (Step 8)

1. Export remaining product images from Figma and drop into `src/assets/products/`.
2. Optional: load Gilroy webfont for typography parity.
3. Optional: visual regression tests (Playwright/Chromatic) against reference PNGs.
4. Optional: real checkout integration or financing calculation.

Run `npm run dev`, resize across mobile/tablet/desktop, and confirm layout matches references. Test persistence: save, reload, verify restore. Reset demo with `localStorage.removeItem('bundle-builder-config-v1')`.
