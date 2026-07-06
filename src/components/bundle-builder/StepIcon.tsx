import cameraStepIcon from '@/assets/icons/camera-step.svg'
import protectionStepIcon from '@/assets/icons/protection-accessories-step.svg'
import planStepIcon from '@/assets/icons/shield-plan-step.svg'
import sensorsStepIcon from '@/assets/icons/sensors-step.svg'
import type { BundleStep } from '@/types'

const STEP_ICON_SRC: Record<BundleStep['iconKey'], string> = {
  camera: cameraStepIcon,
  plan: planStepIcon,
  sensor: sensorsStepIcon,
  shield: protectionStepIcon,
}

type StepIconProps = {
  iconKey: BundleStep['iconKey']
  className?: string
}

export function StepIcon({
  iconKey,
  className = 'size-[1.625rem] shrink-0',
}: StepIconProps) {
  return (
    <img
      src={STEP_ICON_SRC[iconKey]}
      alt=""
      aria-hidden="true"
      className={className}
    />
  )
}
