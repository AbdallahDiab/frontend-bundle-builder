import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { BUNDLE_BUILDER_STORAGE_KEY } from '@/lib/bundle'

afterEach(() => {
  cleanup()
  window.localStorage.removeItem(BUNDLE_BUILDER_STORAGE_KEY)
})
