import getTransformedVueSrc from './utils/get-demo-by-path'
import createVuePlugin from '@vitejs/plugin-vue'
import siteIndexTransformPlugin from './vite-plugin-index-transform'
import cssrVitePlugin from './vite-plugin-css-render'

const fileRegex = /\.(md|vue)$/

/** @type {import('vite').PluginOption} */
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/]
})

export default function crateDemoPlugin() {
  /** @type {import('vite').PluginOption} */
  const demoVitePlugin = {
    name: 'demo-vite',
    transform(_, path) {
      if (fileRegex.test(path)) return getTransformedVueSrc(path)
    },
    async handleHotUpdate(ctx) {
      const { file } = ctx
      if (fileRegex.test(file)) {
        const code = await getTransformedVueSrc(file)
        if(!code) return
        return vuePlugin.handleHotUpdate?.({
          ...ctx,
          read: () => code
        })
      }
    }
  }
  return [siteIndexTransformPlugin, demoVitePlugin, vuePlugin, cssrVitePlugin]
}
