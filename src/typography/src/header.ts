import type { ExtractPublicPropTypes } from '../../_utils'

import { defineComponent, PropType, h, computed } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import { createKey } from '../../_utils/cssr'
import { typographyLight, TypographyTheme } from '../styles'
import  style from './styles/header.cssr'

const headerProps = {
  ...(useTheme.props as ThemeProps<TypographyTheme>),
  type: {
    type: String as PropType<
      'info' | 'success' | 'warning' | 'error' | 'default'
    >
  },
  prefix: String,
  alignText: Boolean
} as const

export type HeaderProps = ExtractPublicPropTypes<typeof headerProps>

const createHeader = (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  defineComponent({
    name: `H${level}`,
    props: headerProps,
    setup(props) {
      const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
      const themeRef = useTheme(
        'Typography',
        'h',
        style,
        typographyLight,
        props,
        mergedClsPrefixRef
      )
      const cssVarsRef = computed(() => {
        const levelStr: `${typeof level}` = `${level}`
        const {
          self: {

            [createKey('headerFontSize', levelStr)]: fontSize }
        } = themeRef.value
        return {
          '--k-font-size': fontSize
        }
      })

      return {
        mergedClsPrefix: mergedClsPrefixRef,
        cssVars: inlineThemeDisabled ? undefined : cssVarsRef
      }
    },
    render() {
      const { mergedClsPrefix } = this
      return h(
        `h${level}`,
        {
          class: [
            `${mergedClsPrefix}-h`,
            `${mergedClsPrefix}-h${level}`,
            {
              [`${mergedClsPrefix}-h--prefix-bar`]: this.prefix,
              [`${mergedClsPrefix}-h--align-text`]: this.alignText
            }
          ],
          style: this.cssVars
        },
        this.$slots
      )
    }
  })

export const H1 = createHeader(1)
export const H2 = createHeader(2)
export const H3 = createHeader(3)
export const H4 = createHeader(4)
export const H5 = createHeader(5)
export const H6 = createHeader(6)
