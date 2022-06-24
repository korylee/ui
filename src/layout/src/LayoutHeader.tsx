import type { ExtractPublicPropTypes } from '../../_utils'

import { computed, CSSProperties, defineComponent, h } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import { LayoutTheme } from '../styles'
import { positionProp } from './interface'
import styles from './styles/layout-header.cssr'
import layoutLight from '../styles/light'

const headerProps = {
  ...(useTheme.props as ThemeProps<LayoutTheme>),
  poisition: positionProp,
  inverted: Boolean,
  bordered: {
    type: Boolean,
    defualt: false
  }
} as const

export type LayoutHeaderProps = ExtractPublicPropTypes<typeof headerProps>

export default defineComponent({
  name: 'LayoutHeader',
  props: headerProps,
  setup(props) {
    const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
    const themeRef = useTheme(
      'Layout',
      'layout-header',
      styles,
      layoutLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed((): CSSProperties => {
      const {
        common: { cubicBezierEaseInOut },
        self
      } = themeRef.value
      return {
        '--k-bezier': cubicBezierEaseInOut
      }
    })
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef
    }
  },
  render() {
    const { mergedClsPrefix } = this
    return (
      <div class={[`${mergedClsPrefix}-layout-header`]} style={this.cssVars}>
        {this.$slots}
      </div>
    )
  }
})
