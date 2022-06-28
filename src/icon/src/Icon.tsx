import { Component, defineComponent, h, mergeProps, PropType } from 'vue'
import { useConfig } from '../../_hooks'
import { ExtractPublicPropTypes } from '../../_utils'

type IconDepth = 1 | 2 | 3 | 4 | 5 | '1' | '2' | '3' | '4' | '5'
const iconProps = {
  depth: [String, Number] as PropType<IconDepth>,
  component: Object as PropType<Component>
}

export type IconProps = ExtractPublicPropTypes<typeof iconProps>

export default defineComponent({
  __icon__: true,
  name: 'Icon',
  inheritAttrs: false,
  props: iconProps,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)

    return { mergedClsPrefix: mergedClsPrefixRef }
  },
  render() {
    const { mergedClsPrefix } = this
    return h(
      'i',
      mergeProps(this.$attrs, {
        role: 'img',
        class: [
          `${mergedClsPrefix}-icon`,
          {
            [`${mergedClsPrefix}-icon--depth`]: this.depth
          }
        ],
        style: []
      }),
      this.component ? h(this.component) : this.$slots
    )
  }
})
