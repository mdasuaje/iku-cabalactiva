import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Mock environment variables
beforeEach(() => {
  vi.stubEnv('VITE_PAYPAL_SINGLE_SESSION', 'https://paypal.com/test-single')
  vi.stubEnv('VITE_PAYPAL_FULL_PACKAGE', 'https://paypal.com/test-full')
  vi.stubEnv('VITE_STRIPE_CHECKOUT', 'https://stripe.com/test')
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})