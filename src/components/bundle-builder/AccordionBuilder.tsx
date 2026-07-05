import { useCallback, useState } from 'react'
import { BUNDLE_STEPS } from '@/data/bundleSteps'
import { getProductsByStep, productHasVariants } from '@/data/products'
import {
  getActiveVariantId,
  getProductQuantity,
  getVariantQuantity,
} from '@/lib/bundle'
import { useBundleBuilderContext } from './useBundleBuilderContext'
import type { UseBundleBuilderReturn } from '@/hooks/useBundleBuilder'
import type { BundleStep, BundleStepId, Product } from '@/types'
import { ProductCard } from './ProductCard'
import cameraStepIcon from '@/assets/icons/camera-step.svg'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import chevronUpIcon from '@/assets/icons/chevron-up.svg'
import protectionStepIcon from '@/assets/icons/protection-accessories-step.svg'
import planStepIcon from '@/assets/icons/shield-plan-step.svg'
import sensorsStepIcon from '@/assets/icons/sensors-step.svg'

const STEP_ICON_SRC: Record<BundleStep['iconKey'], string> = {
  camera: cameraStepIcon,
  plan: planStepIcon,
  sensor: sensorsStepIcon,
  shield: protectionStepIcon,
}

function getCardQuantity(
  product: Product,
  configuration: UseBundleBuilderReturn['configuration'],
): number {
  if (productHasVariants(product)) {
    const variantId =
      getActiveVariantId(configuration, product.id) ?? product.defaultVariantId
    if (!variantId) return 0
    return getVariantQuantity(configuration, product.id, variantId)
  }

  return getProductQuantity(configuration, product.id)
}

function getNextStepTitle(stepIndex: number): string | undefined {
  return BUNDLE_STEPS[stepIndex + 1]?.title
}

type AccordionStepPanelProps = {
  step: BundleStep
  stepIndex: number
  isOpen: boolean
  selectedCount: number
  panelId: string
  headerId: string
  onToggle: () => void
  onNext: () => void
  configuration: UseBundleBuilderReturn['configuration']
  onIncrement: (productId: Product['id']) => void
  onDecrement: (productId: Product['id']) => void
  onSelectVariant: (
    productId: Product['id'],
    variantId: NonNullable<Product['defaultVariantId']>,
  ) => void
}

function AccordionStepPanel({
  step,
  stepIndex,
  isOpen,
  selectedCount,
  panelId,
  headerId,
  onToggle,
  onNext,
  configuration,
  onIncrement,
  onDecrement,
  onSelectVariant,
}: AccordionStepPanelProps) {
  const products = getProductsByStep(step.id)
  const nextStepTitle = getNextStepTitle(stepIndex)
  const isLastStep = stepIndex === BUNDLE_STEPS.length - 1

  return (
    <div
      className={`border-b border-gray-300 last:border-b-0 ${
        isOpen ? 'bg-surface-muted' : 'bg-surface'
      }`}
    >
      <h3 className="m-0">
        <button
          id={headerId}
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-200/50 sm:px-5 sm:py-4"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={
            selectedCount > 0
              ? `${step.title}, ${selectedCount} selected`
              : step.title
          }
          onClick={onToggle}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[0.6875rem] font-medium tracking-[0.06em] text-gray-600 uppercase">
              Step {step.stepNumber} of {BUNDLE_STEPS.length}
            </span>
            <span className="flex items-center gap-2.5">
              <img
                src={STEP_ICON_SRC[step.iconKey]}
                alt=""
                aria-hidden="true"
                className="size-6 shrink-0 text-text-primary"
              />
              <span
                className={`text-base font-semibold sm:text-lg ${
                  isOpen ? 'text-text-primary' : 'text-gray-600'
                }`}
              >
                {step.title}
              </span>
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-2">
            {selectedCount > 0 && (
              <span className="text-sm font-medium text-wyze-purple">
                {selectedCount} selected
              </span>
            )}
            <img
              src={isOpen ? chevronUpIcon : chevronDownIcon}
              alt=""
              aria-hidden="true"
              className="size-4 shrink-0 text-wyze-purple"
            />
          </span>
        </button>
      </h3>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="border-t border-gray-300 px-4 pt-4 pb-5 sm:px-5 sm:pb-6"
        >
          {products.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
              {products.map((product) => {
                const activeVariantId =
                  getActiveVariantId(configuration, product.id) ??
                  product.defaultVariantId

                return (
                  <li key={product.id} className="min-w-0">
                    <ProductCard
                      product={product}
                      activeVariantId={activeVariantId}
                      quantity={getCardQuantity(product, configuration)}
                      onVariantChange={(variantId) =>
                        onSelectVariant(product.id, variantId)
                      }
                      onIncrement={() => onIncrement(product.id)}
                      onDecrement={() => onDecrement(product.id)}
                      compact
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex min-h-24 items-center justify-center rounded-card border border-dashed border-gray-300 bg-surface px-4 py-8 text-center">
              <p className="m-0 text-sm text-text-secondary">
                Products for this step will appear here.
              </p>
            </div>
          )}

          {!isLastStep && nextStepTitle && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="inline-flex min-w-[12rem] items-center justify-center rounded-control border border-wyze-purple bg-surface px-6 py-2.5 text-sm font-semibold text-wyze-purple transition-colors hover:bg-gray-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple"
                onClick={onNext}
              >
                Next: {nextStepTitle}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AccordionBuilder() {
  const [openStepId, setOpenStepId] = useState<BundleStepId>('cameras')
  const {
    configuration,
    selectedCountByStep,
    increment,
    decrement,
    selectVariant,
  } = useBundleBuilderContext()

  const handleToggleStep = useCallback((stepId: BundleStepId) => {
    setOpenStepId((current) => (current === stepId ? current : stepId))
  }, [])

  const handleNextStep = useCallback((stepIndex: number) => {
    const nextStep = BUNDLE_STEPS[stepIndex + 1]
    if (nextStep) {
      setOpenStepId(nextStep.id)
    }
  }, [])

  return (
    <section aria-label="Bundle builder accordion">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-text-primary sm:text-[1.75rem]">
          Let&apos;s get started!
        </h2>
      </header>

      <div className="overflow-hidden rounded-card border border-gray-300 bg-surface shadow-panel">
        {BUNDLE_STEPS.map((step, index) => {
          const isOpen = openStepId === step.id
          const panelId = `accordion-panel-${step.id}`
          const headerId = `accordion-header-${step.id}`

          return (
            <AccordionStepPanel
              key={step.id}
              step={step}
              stepIndex={index}
              isOpen={isOpen}
              selectedCount={selectedCountByStep[step.id]}
              panelId={panelId}
              headerId={headerId}
              onToggle={() => handleToggleStep(step.id)}
              onNext={() => handleNextStep(index)}
              configuration={configuration}
              onIncrement={increment}
              onDecrement={decrement}
              onSelectVariant={selectVariant}
            />
          )
        })}
      </div>
    </section>
  )
}
