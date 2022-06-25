import type { Property } from 'csstype'

import { CSSProperties, defineComponent, h, PropType, VNodeChild } from 'vue'
import { ThemeProps, useTheme } from '../../_hooks'
import { ExtractPublicPropTypes, BasicSize, flatten } from '../../_utils'
import { SpaceTheme } from '../styles/light'

const spaceProps = {
  ...(useTheme.props as ThemeProps<SpaceTheme>),
  justify: {
    type: String as PropType<Property.JustifyContent>,
    default: 'start'
  },
  align: String as PropType<Property.AlignItems>,
  inline: Boolean,
  vertical: Boolean,
  size: {
    type: [String, Number, Array] as PropType<
      BasicSize | number | [number, number]
    >,
    default: 'medium'
  },
  wrapItem: { type: Boolean, default: true },
  wrap: { type: Boolean, default: true },
  itemStyle: [String, Object, Array] as PropType<
    string | CSSProperties | (string | CSSProperties)[]
  >,
  // internal
  internalUseGap: { type: Boolean, default: undefined }
} as const

export type SpaceProps = ExtractPublicPropTypes<typeof spaceProps>

export default defineComponent({
  name: 'Space',
  props: spaceProps,
  render() {
    const { vertical } = this
    const children = flatten((this.$slots.default?.() ?? []) as VNodeChild[])
    return (
      <div
        role="none"
        style={{
          display: this.inline ? 'inline-flex' : 'flex',
          flexDirection: vertical ? 'column' : 'row',
          justifyContent: this.justify,
          flexWrap: !this.wrap || vertical ? 'nowrap' : 'wrap'
        }}
      >
        {children}
      </div>
    )
  }
})
