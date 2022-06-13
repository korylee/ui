import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { ConfigProvider } from '../../config-provider'
import Code from '../src/Code'
import hljs from 'highlight.js/lib/core'
import { setup } from '@css-render/vue3-ssr'
import { renderToString } from '@vue/server-renderer'

describe('SSR', () => {
  it('works', async () => {
    const app = createSSRApp(() => (
      <ConfigProvider hljs={hljs}>
        <Code />
      </ConfigProvider>
    ))
    setup(app)
    try {
      await renderToString(app)
    } catch (e) {
      expect(e).not.toBeTruthy()
    }
  })
})
