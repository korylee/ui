/// <reference types="vitest" />

import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel'
import createDemoPlugin from './build/vite-plugin-demo'
const path = require('node:path')

const env = process.env.NODE_ENV

export default defineConfig({
  root: __dirname,
  plugins: createDemoPlugin(),
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias:
      env !== 'production'
        ? [
            {
              find: '@korylee/ui',
              replacement: path.resolve(__dirname, './src')
            }
          ]
        : undefined
  },
  define: {
    __IS_DEV__: env !== 'production',
    'process.env.NODE_ENV': `'${env}'`
  },
  optimizeDeps: {
    include: [
      '@css-render/plugin-bem',
      'css-render',
      '@css-render/vue3-ssr',
      'date-fns/esm',
      // 'evtd',
      'highlight.js',
      'async-validator',
      'lodash-es',
      'seemly',
      'vue-router',
      // 'vdirs',
      'vooks',
      'vue',
      'vueuc'
    ],
    exclude: ['__INDEX__']
  },
  build: {
    outDir: 'site',
    rollupOptions: {
      plugins: [babel({ babelHelpers: 'bundled' })]
    }
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
    // jsxInject: `import { h } from 'vue'`
  }
})
