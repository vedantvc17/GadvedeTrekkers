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
})
