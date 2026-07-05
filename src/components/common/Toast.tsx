import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ToastContext, type ToastContextValue } from './useToast'

type ToastItem = {
  id: string
  message: string
  durationMs: number
}

const DEFAULT_TOAST_DURATION_MS = 4000

function createToastId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, options?: { durationMs?: number }) => {
      const id = createToastId()
      const durationMs = options?.durationMs ?? DEFAULT_TOAST_DURATION_MS

      setToasts((current) => [...current, { id, message, durationMs }])

      const timer = setTimeout(() => {
        dismissToast(id)
      }, durationMs)

      timersRef.current.set(id, timer)
    },
    [dismissToast],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer)
      }
      timers.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <ToastMessage
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

type ToastMessageProps = {
  toast: ToastItem
  onDismiss: () => void
}

function ToastMessage({ toast, onDismiss }: ToastMessageProps) {
  const titleId = useId()

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      className="pointer-events-auto flex max-w-md items-start gap-3 rounded-card border border-gray-300/80 bg-surface px-4 py-3 shadow-panel"
    >
      <p id={titleId} className="m-0 flex-1 text-sm text-text-primary">
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="shrink-0 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wyze-purple"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  )
}
