import CssRender, { CNode } from 'css-render'
import BEMPlugin from '@css-render/plugin-bem'

const namespace = 'k'
const prefix = `.${namespace}-`
const elementPrefix = '__'
const modifierPrefix = '--'

const cssr = CssRender()
const plugin = BEMPlugin({
  blockPrefix: prefix,
  elementPrefix,
  modifierPrefix
})

cssr.use(plugin)

const { c, find } = cssr
const { cB, cE, cM, cNotM } = plugin

function insideModal(style: CNode) {
  return c(
    ({ props: { bPrefix } }) =>
      `${bPrefix || prefix}modalm ${bPrefix || prefix}drawer`,
    [style]
  )
}

const cCB: typeof cB = (...args: any[]) => c('>', [(cB as any)(...args)])

export { c, cB, cE, cM, cNotM, cCB, insideModal, prefix, namespace, find }

export { createKey } from './create-key'
