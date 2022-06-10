const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: ['prettier'],
  globals: {
    __IS_DEV__: 'readonly'
  },
  overrides: [
    {
      files: '*.vue',
      extends: [
        '@vue/typescript/recommended',
        'plugin:vue/vue3-recommended',
        '@vue/typescript'
      ]
    },
    {
      files: ['*.vue', '*.js'],
      extends: ['plugin:vue/essential'],
      rules: {
        'vue/multiline-html-element-content-newline': 0,
        'vue/multi-word-component-names': 0,
        'vue/max-attributes-per-line': [
          2,
          {
            singleline: 20,
            multiline: 1
          }
        ],
        'vue/require-default-prop': 0,
        'vue/no-multiple-template-root': 0,
        'vue/no-lone-template': 0,
        'vue/no-v-model-argument': 0,
        'vue/one-component-per-file': 0,
        'import/no-cycle': 1
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['standard-with-typescript', 'plugin:import/typescript'],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: Fue
        }
      },
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/prefer-nullish-coalescing': 0,
        '@typescript-eslint/naming-convention': 0,
        'multiline-ternary': 0,
        'no-void': 0,
        'import/no-cycle': 1,
        '@typescript-eslint/explicit-function-return-type': ['warn'],
        '@typescript-eslint/space-before-function-paren': 0
      }
    }
  ]
})
