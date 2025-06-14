import { resolve } from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'lib/main/main.ts'),
        },
      },
    },
    resolve: {
      alias: {
        '@/app': resolve(__dirname, 'app'),
        '@/lib': resolve(__dirname, 'lib'),
        '@/locales': resolve(__dirname, 'locales'),
        '@/resources': resolve(__dirname, 'resources'),
        '@/ui': resolve(__dirname, 'app/components/ui'),
        '@/components': resolve(__dirname, 'app/components'),
        '@/types': resolve(__dirname, 'app/types'),
        '@/styles': resolve(__dirname, 'app/styles'),
        '@/hooks': resolve(__dirname, 'app/hooks'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'lib/preload/preload.ts'),
        },
      },
    },
    resolve: {
      alias: {
        '@/app': resolve(__dirname, 'app'),
        '@/lib': resolve(__dirname, 'lib'),
        '@/locales': resolve(__dirname, 'locales'),
        '@/resources': resolve(__dirname, 'resources'),
        '@/ui': resolve(__dirname, 'app/components/ui'),
        '@/components': resolve(__dirname, 'app/components'),
        '@/types': resolve(__dirname, 'app/types'),
        '@/styles': resolve(__dirname, 'app/styles'),
        '@/hooks': resolve(__dirname, 'app/hooks'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: './app',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'app/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@/app': resolve(__dirname, 'app'),
        '@/lib': resolve(__dirname, 'lib'),
        '@/locales': resolve(__dirname, 'locales'),
        '@/resources': resolve(__dirname, 'resources'),
        '@/ui': resolve(__dirname, 'app/components/ui'),
        '@/components': resolve(__dirname, 'app/components'),
        '@/types': resolve(__dirname, 'app/types'),
        '@/styles': resolve(__dirname, 'app/styles'),
        '@/hooks': resolve(__dirname, 'app/hooks'),
      },
    },
    plugins: [tailwindcss(), react()],
  },
})
