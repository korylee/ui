import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel'
import createDemoPlugin from './build/vite-plugin-demo'
const path = require('node:path')

const env = process.env.NODE_ENV

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: createDemoPlugin(),
  resolve: {
    alias:
      env !== 'production'
        ? [
            {
              find: 'kory-ui',
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
    include: ['async-validator', 'lodash-es', 'vue-router'],
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
  }
})
