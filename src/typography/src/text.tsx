import { computed, CSSProperties, defineComponent, h, PropType } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import { createKey, ExtractPublicPropTypes } from '../../_utils'
import { typographyLight, TypographyTheme } from '../styles'
import style from './styles/text.cssr'

const textProps = {
  ...(useTheme.props as ThemeProps<TypographyTheme>),
  tag: { type: String, default: 'span' },
  type: { type: String, default: 'default' },
  delete: Boolean,
  code: Boolean,
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  depth: [String, Number] as PropType<1 | 2 | 3 | '1' | '2' | '3'>
} as const

export type TextProps = ExtractPublicPropTypes<typeof textProps>

export default defineComponent({
  name: 'Text',
  props: textProps,
  setup(props) {
    const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
    const themeRef = useTheme(
      'Typography',
      'text',
      style,
      typographyLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed((): CSSProperties => {
      const { type, depth } = props
      const textColorKey =
        type === 'default'
          ? depth === undefined
            ? 'textColor'
            : `textColor${depth}Depth`
          : createKey('textColor', type)
      const {
        common: { fontWeightStrong, fontFamilyMono, cubicBezierEaseInOut },
        self: {
          [textColorKey as 'textColor']: textColor,
          codeBorder,
          codeColor,
          codeTextColor,
          codeBorderRadius
        }
      } = themeRef.value
      return {
        '--k-bezier': cubicBezierEaseInOut,
        '--k-text-color': textColor,
        '--k-font-weight-font': fontWeightStrong,
        '--k-font-family-mono': fontFamilyMono,
        '--k-code-border': codeBorder,
        '--k-code-color': codeColor,
        '--k-code-text-color': codeTextColor,
        '--k-code-border-radius': codeBorderRadius
      }
    })

    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef
    }
  },
  render() {
    const { mergedClsPrefix, tag: Tag, cssVars, $slots } = this
    const textClass = [
      `${mergedClsPrefix}-text`,
      {
        [`${mergedClsPrefix}-text--code`]: this.code,
        [`${mergedClsPrefix}-text--delete`]: this.delete,
        [`${mergedClsPrefix}-text--strong`]: this.strong,
        [`${mergedClsPrefix}-text--italic`]: this.italic,
        [`${mergedClsPrefix}-text--underline`]: this.underline
      }
    ]

    if (this.code) {
      return (
        <code class={textClass} style={cssVars}>
          {this.delete ? <del>{$slots}</del> : $slots}
        </code>
      )
    }
    if (this.delete)
      return (
        <del class={textClass} style={cssVars}>
          {$slots}
        </del>
      )
    return h(this.tag, { class: textClass, style: cssVars }, $slots)
  }
})
