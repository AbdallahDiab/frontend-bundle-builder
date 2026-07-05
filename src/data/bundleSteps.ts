import type { BundleStep } from '@/types'

export const BUNDLE_STEPS: readonly BundleStep[] = [
  {
    id: 'cameras',
    stepNumber: 1,
    title: 'Choose your cameras',
    iconKey: 'camera',
    category: 'cameras',
    nextButtonLabel: 'Continue to plan',
  },
  {
    id: 'plan',
    stepNumber: 2,
    title: 'Choose your plan',
    iconKey: 'plan',
    category: 'plan',
    nextButtonLabel: 'Continue to sensors',
  },
  {
    id: 'sensors',
    stepNumber: 3,
    title: 'Choose your sensors',
    iconKey: 'sensor',
    category: 'sensors',
    nextButtonLabel: 'Continue to protection',
  },
  {
    id: 'accessories',
    stepNumber: 4,
    title: 'Add extra protection',
    iconKey: 'shield',
    category: 'accessories',
    nextButtonLabel: 'Review bundle',
  },
] as const

export const BUNDLE_STEP_BY_ID = Object.fromEntries(
  BUNDLE_STEPS.map((step) => [step.id, step]),
) as Record<BundleStep['id'], BundleStep>
