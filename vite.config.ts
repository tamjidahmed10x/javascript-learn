import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // Order matters: Start plugin first, React plugin after it.
    tanstackStart(),
    nitro({
      // Vercel sets VERCEL=1 at build time → use the vercel preset there.
      // Everywhere else (local, Cloudflare) the cloudflare-module preset stays the default.
      preset: process.env.VERCEL ? 'vercel' : 'cloudflare-module',
      compatibilityDate: '2024-09-23',
    }),
    viteReact(),
    tailwindcss(),
  ],
})
