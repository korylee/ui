import { defineComponent, h } from 'vue'
import { ExtractPublicPropTypes } from '../../_utils'

const textProps = {
  code: Boolean,
  tag: String
} as const

export type TextProps = ExtractPublicPropTypes<typeof textProps>

export default defineComponent({
  name: 'Text',
  props: textProps,
  render() {
    if (this.code) return <code></code>
    const Tag = this.tag || 'span'
    return <Tag>{this.$slots}</Tag>
  }
})
