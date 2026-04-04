import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure all routes fall back to index.html so React Router handles them
    // This fixes copied links (e.g. /employee/direct-booking) when opened in a new tab
    historyApiFallback: true,
  },
  preview: {
    // Same fallback for `vite preview`
    historyApiFallback: true,
  },

  // ── Vitest ────────────────────────────────────────────────────────────────
  // Only run unit/integration tests that live inside src/.
  // The tests/ directory belongs to Playwright — Vitest must never touch it,
  // otherwise Playwright's `test.describe()` is called outside the Playwright
  // runner and throws "did not expect test.describe() to be called here".
  test: {
    include:     ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude:     ['tests/**', 'node_modules/**', 'dist/**'],
    environment: 'node',
  },
})
