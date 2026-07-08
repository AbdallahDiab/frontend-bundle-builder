import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from 'react'
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
import { StepIcon } from './StepIcon'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import chevronUpIcon from '@/assets/icons/chevron-up.svg'

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

const STEP_LABEL_BASE =
  'font-gilroy-medium align-middle text-step-label font-normal uppercase leading-none tracking-step-label'

const STEP_LABEL_OPEN = `${STEP_LABEL_BASE} text-step-label-open`
const STEP_LABEL_CLOSED = `${STEP_LABEL_BASE} text-step-label-closed`

const STEP_TITLE =
  'block min-w-0 truncate pb-1 font-gilroy-semibold text-accordion-step-title font-normal leading-accordion-step-title tracking-normal text-gray-obsidian'

const STEP_SELECTED_COUNT =
  'text-center font-gilroy-medium text-accordion-selected-count font-normal leading-accordion-selected-count tracking-normal text-wyze-purple'

const STEP_NEXT_BUTTON =
  'text-center align-middle font-gilroy-semibold text-accordion-next-button font-normal leading-accordion-next-button tracking-normal text-wyze-purple'

function useAccordionPanel(isOpen: boolean) {
  const [isPanelRetained, setIsPanelRetained] = useState(isOpen)
  const [isPanelExpanded, setIsPanelExpanded] = useState(isOpen)
  const wasOpenRef = useRef(isOpen)

  const isPanelMounted = isOpen || isPanelRetained

  useEffect(() => {
    const wasOpen = wasOpenRef.current
    wasOpenRef.current = isOpen

    if (isOpen) {
      const retainFrame = requestAnimationFrame(() => {
        setIsPanelRetained(true)
      })

      if (!wasOpen) {
        const expandFrame = requestAnimationFrame(() => {
          setIsPanelExpanded(false)
          requestAnimationFrame(() => setIsPanelExpanded(true))
        })

        return () => {
          cancelAnimationFrame(retainFrame)
          cancelAnimationFrame(expandFrame)
        }
      }

      return () => cancelAnimationFrame(retainFrame)
    }

    if (!wasOpen) return

    const collapseFrame = requestAnimationFrame(() => {
      setIsPanelExpanded(false)
    })
    const unmountTimer = window.setTimeout(() => {
      setIsPanelRetained(false)
    }, 250)

    return () => {
      cancelAnimationFrame(collapseFrame)
      window.clearTimeout(unmountTimer)
    }
  }, [isOpen])

  const handlePanelTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'grid-template-rows' || isOpen) return
    setIsPanelRetained(false)
  }

  return { isPanelMounted, isPanelExpanded, handlePanelTransitionEnd }
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
  const { isPanelMounted, isPanelExpanded, handlePanelTransitionEnd } =
    useAccordionPanel(isOpen)

  const stepLabelId = `accordion-step-label-${step.id}`

  return (
    <div
      className={
        isOpen
          ? 'my-2 overflow-hidden rounded-[var(--radius-accordion-open)] border border-wyze-purple-border bg-accordion-open motion-safe:transition-[border-color,background-color] motion-safe:duration-200 motion-safe:ease-out'
          : 'bg-surface motion-safe:transition-[border-color,background-color] motion-safe:duration-200 motion-safe:ease-out'
      }
    >
      {!isOpen && (
        <p
          id={stepLabelId}
          className={`m-0 px-4 pt-4 pb-2 sm:px-5 sm:pt-5 ${STEP_LABEL_CLOSED}`}
        >
          Step {step.stepNumber} of {BUNDLE_STEPS.length}
        </p>
      )}

      <div className={isOpen ? undefined : 'border-y border-gray-300'}>
        <h3 className="m-0">
          <button
            id={headerId}
            type="button"
            className={`flex w-full cursor-pointer text-left motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-wyze-purple ${
              isOpen
                ? 'flex-col gap-2 px-4 py-4 hover:bg-gray-200/30 sm:px-5 sm:py-5'
                : 'items-center justify-between gap-3 px-4 py-4 hover:bg-gray-200/40 sm:px-5 sm:py-5'
            }`}
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={
              selectedCount > 0
                ? `${step.title}, ${selectedCount} selected`
                : step.title
            }
            onClick={onToggle}
          >
            {isOpen && (
              <span id={stepLabelId} className={STEP_LABEL_OPEN}>
                Step {step.stepNumber} of {BUNDLE_STEPS.length}
              </span>
            )}

            <span
              className={`flex items-center gap-3 ${
                isOpen
                  ? 'w-full justify-between'
                  : 'min-w-0 flex-1 justify-between'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <StepIcon iconKey={step.iconKey} />
                <span className={STEP_TITLE}>{step.title}</span>
              </span>

              <span className="flex shrink-0 items-center gap-2.5">
                {selectedCount > 0 && (
                  <span className={STEP_SELECTED_COUNT}>
                    {selectedCount} selected
                  </span>
                )}
                <img
                  src={isOpen ? chevronUpIcon : chevronDownIcon}
                  alt=""
                  aria-hidden="true"
                  className="size-3 shrink-0"
                />
              </span>
            </span>
          </button>
        </h3>
      </div>

      {isPanelMounted && (
        <div
          className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 motion-safe:ease-out ${
            isPanelExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          onTransitionEnd={handlePanelTransitionEnd}
        >
          <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            aria-hidden={!isOpen}
            inert={!isOpen ? true : undefined}
            className="min-h-0 overflow-hidden"
          >
            <div className="px-4 pb-5 sm:px-5 sm:pb-6 lg:p-[15px]">
              {products.length > 0 ? (
                <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 md:gap-[15px] [&>li:last-child:nth-child(odd)]:md:col-span-2 [&>li:last-child:nth-child(odd)]:md:mx-auto [&>li:last-child:nth-child(odd)]:md:max-w-[calc(50%-0.46875rem)] [&>li:last-child:nth-child(odd)]:md:w-full">
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
                <div className="mt-6 flex justify-center sm:mt-8">
                  <button
                    type="button"
                    className={`inline-flex min-h-11 min-w-[14rem] cursor-pointer items-center justify-center rounded-accordion-open border border-wyze-purple bg-review-panel px-8 py-2.5 motion-safe:transition-[colors,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out hover:bg-gray-200/70 hover:shadow-panel motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple ${STEP_NEXT_BUTTON}`}
                    onClick={onNext}
                  >
                    Next: {nextStepTitle}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AccordionBuilder() {
  const [openStepId, setOpenStepId] = useState<BundleStepId | null>('cameras')
  const {
    configuration,
    selectedCountByStep,
    increment,
    decrement,
    selectVariant,
  } = useBundleBuilderContext()

  const handleToggleStep = useCallback((stepId: BundleStepId) => {
    setOpenStepId((current) => (current === stepId ? null : stepId))
  }, [])

  const handleNextStep = useCallback((stepIndex: number) => {
    const nextStep = BUNDLE_STEPS[stepIndex + 1]
    if (nextStep) {
      setOpenStepId(nextStep.id)
    }
  }, [])

  return (
    <section aria-label="Bundle builder accordion">
      <header className="mb-5 lg:hidden">
        <h1
          className="text-center text-2xl font-bold text-text-primary sm:text-[1.75rem]"
          data-testid="builder-mobile-heading"
        >
          Let&apos;s get started!
        </h1>
      </header>

      <div>
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
