import type { TypographyDepth } from './interface'

import { computed, defineComponent, PropType, h } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import { typographyLight, TypographyTheme } from '../styles'
import { ExtractPublicPropTypes } from '../../_utils'

const pProps = {
  ...(useTheme.props as ThemeProps<TypographyTheme>),
  depth: [String, Number] as PropType<TypographyDepth>
} as const

export type PProps = ExtractPublicPropTypes<typeof pProps>

export default defineComponent({
  name: 'P',
  props: pProps,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    const themeRef = useTheme(
      'Typography',
      'p',
      undefined,
      typographyLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed(() => {
      const { depth = '1' } = props
      const {
        common: { cubicBezierEaseInOut },
        self: { pFontSize, pMargin }
      } = themeRef.value
      return {
        '--k-bezier': cubicBezierEaseInOut,
        '--k-font-size': pFontSize,
        '--k-margin': pMargin
      }
    })
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: cssVarsRef
    }
  },
  render() {
    return (
      <p class={[`${this.mergedClsPrefix}-p`]} style={this.cssVars}>
        {this.$slots}
      </p>
    )
  }
})
