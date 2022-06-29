const path = require('node:path')
const merge = require('deepmerge')
const { defineConfig } = require('rollup')
const esbuild = require('rollup-plugin-esbuild').default
const babel = require('@rollup/plugin-babel').default
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve').default

const extensions = ['.mjs', '.js', '.json', '.ts']

const baseConfig = defineConfig({
  input: path.resolve('./src/index.ts'),
  plugins: [
    nodeResolve({ extensions }),
    esbuild({
      target: 'esnext',
      sourceMap: true
    }),
    babel({
      extensions,
      babelHelpers: 'bundled'
    }),
    commonjs()
  ],
  external: ['vue'],
  output: {
    name: 'kory',
    format: 'umd',
    exports: 'named',
    globals: { vue: 'Vue' }
  }
})

const devConfig = defineConfig({
  output: {
    file: path.resolve('dist/index.ts')
  }
})

const prodConfig = defineConfig({
  output: {
    file: path.resolve('dist/index.prod.ts')
  }
})

module.exports = [merge(baseConfig, devConfig), merge(baseConfig, prodConfig)]
