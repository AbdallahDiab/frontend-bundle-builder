# Cursor Handoff — Step 4: Accordion Builder UI

## Summary

Step 4 replaces the temporary `CameraProductShowcase` with a real 4-step accordion builder. Product cards render from `PRODUCT_CATALOG` inside a responsive grid. Accordion navigation is local UI state; bundle selection continues to use `useBundleBuilder`. Review panel remains a placeholder.

## What changed

- Created `AccordionBuilder` with 4 steps from `BUNDLE_STEPS`.
- Wired `BuilderArea` to render `AccordionBuilder` instead of the temporary showcase.
- Added optional `compact` prop to `ProductCard` for tighter accordion grid cells.
- Removed `CameraProductShowcase.tsx` (no longer needed).
- Added accordion component tests.
- Updated README current status.

## Files created

| File                                                      | Purpose                                  |
| --------------------------------------------------------- | ---------------------------------------- |
| `src/components/bundle-builder/AccordionBuilder.tsx`      | 4-step accordion builder UI              |
| `src/components/bundle-builder/AccordionBuilder.test.tsx` | Accordion behavior and integration tests |
| `CURSOR_HANDOFF_STEP_4.md`                                | This document                            |

## Files updated

| File                                            | Changes                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| `src/components/bundle-builder/BuilderArea.tsx` | Renders `AccordionBuilder`                         |
| `src/components/bundle-builder/ProductCard.tsx` | Added `compact` layout variant                     |
| `src/components/bundle-builder/index.ts`        | Export `AccordionBuilder`; removed showcase export |
| `README.md`                                     | Step 4 status, accordion notes                     |

## Files removed

| File                                                      | Reason                         |
| --------------------------------------------------------- | ------------------------------ |
| `src/components/bundle-builder/CameraProductShowcase.tsx` | Replaced by `AccordionBuilder` |

## Accordion behavior summary

| Behavior          | Implementation                                                        |
| ----------------- | --------------------------------------------------------------------- |
| Default open step | Step 1 (`cameras`) via `useState<BundleStepId>('cameras')`            |
| Header click      | Opens clicked step; keeps one step open (open step does not collapse) |
| Next button       | Advances to next step; label `Next: {next step title}`                |
| Final step        | No Next button                                                        |
| Selected counts   | From `selectedCountByStep` — distinct lines, purple text when > 0     |
| State separation  | `openStepId` is local; product qty/variants use `useBundleBuilder`    |

### Seeded selected counts (initial)

| Step                 | Count |
| -------------------- | ----- |
| Cameras              | 2     |
| Plan                 | 1     |
| Sensors              | 2     |
| Add extra protection | 1     |

## Product grid / layout summary

- Expanded panel: `grid-cols-1 md:grid-cols-2` with `gap-3`.
- Mobile: single column.
- Desktop (with or without review panel): 2-column grid; 5 camera cards flow 2+2+1.
- `ProductCard` uses `compact` inside accordion for smaller image, padding, and min-height.
- Steps without catalog products show a dashed placeholder (all 4 steps currently have products).

## Accessibility

- Step headers are `<button>` elements with `aria-expanded`, `aria-controls`, and explicit `aria-label`.
- Panels use `role="region"` with `aria-labelledby` pointing to header id.
- Stable ids: `accordion-header-{stepId}`, `accordion-panel-{stepId}`.
- Next buttons are real `<button type="button">` elements.

## Tests added

| File                        | Tests                                                                                                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccordionBuilder.test.tsx` | 10 — default open step, 4 headers, selected counts, step toggle, Next navigation, no Next on final step, camera cards from data, quantity interaction, variant switching, plan step products |

**Total: 35 tests** (17 business logic + 18 component). All pass.

## Commands run

```bash
npm run typecheck   # PASS
npm run lint        # PASS
npm run test        # PASS (35/35)
npm run build       # PASS
npm run format:check # PASS (after npm run format)
```

## Visual fidelity notes

Aligned to `Frame 1735.png`, `Frame 8234.png`, `Frame 1736.png`, and `iPhone 13 & 14 - 35.png`:

- "Let's get started!" page heading
- STEP X OF 4 labels, step icons, titles, purple selected counts, chevrons
- Expanded step muted background (`surface-muted`)
- Purple-outline Next buttons with next-step title
- 2-column product grid on desktop; compact horizontal cards
- Collapsed step headers on white; open step content on gray background

Still pending: exact Gilroy typography, precise spacing tokens, remaining real product images.

## Known issues

1. **13 product images still placeholders** — unchanged from Step 3.
2. **Accordion + review panel share separate `useBundleBuilder` instances** — each call creates independent state. Review panel placeholder does not read bundle state yet; wiring a shared provider is needed in Step 5.
3. **Fifth camera card** in 2-column grid is left-aligned, not centered (acceptable for now).
4. **Step icons** remain hand-authored SVG approximations.

## Suggested next step (Step 5)

1. **Introduce `BundleBuilderProvider`** so `AccordionBuilder` and `ReviewPanel` share one `useBundleBuilder` instance.
2. **Implement `ReviewPanel`** using `groupedSelectedItems`, `pricingSummary`, `shippingSummary`, and `satisfaction-guarantee.png`.
3. **Export remaining product images** from Figma (especially Cam v4 variants).
4. Optional: localStorage persistence and checkout behavior.

Run `npm run dev` and compare against `src/assets/references/Frame 1735.png` and `Frame 8234.png`.
