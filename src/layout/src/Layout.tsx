import { CSSProperties, defineComponent, PropType, ref, h, computed } from 'vue'
import useConfig from '../../_hooks/use-config'
import useTheme, { ThemeProps } from '../../_hooks/use-theme'
import layoutLight, { LayoutTheme } from '../styles/light'
import { positionProp } from './interface'
import style from './styles/layout.cssr'

const layoutProps = {
  ...(useTheme.props as ThemeProps<LayoutTheme>),
  embedded: Boolean,
  position: positionProp,
  nativeScrollBar: {
    type: Boolean,
    default: true
  },
  // TODO ScrollbarProps interface
  scrollbarProps: Object as PropType<Partial<any>>,
  onScroll: Function as PropType<(e: Event) => void>,
  contentStyle: {
    type: [String, Object] as PropType<string | CSSProperties>,
    default: ''
  },
  hasSider: Boolean,
  siderPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  }
} as const

export const createLayoutComponent = (isContent: boolean) =>
  defineComponent({
    name: isContent ? 'LayoutContent' : 'Layout',
    props: layoutProps,
    setup(props) {
      const scrollableElRef = ref<HTMLElement | null>(null)
      const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
      const themeRef = useTheme(
        'Layout',
        '-layout',
        style,
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
          '--k-bezier': cubicBezierEaseInOut,
          '--k-color': props.embedded ? self.colorEmbedded : self.color,
          '--k-text-color': self.textColor
        }
      })

      return {
        scrollableElRef,
        mergedTheme: themeRef,
        cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
        mergedClsPrefix: mergedClsPrefixRef
      }
    },
    render() {
      const { mergedClsPrefix } = this
      return (
        <div style={this.cssVars}>
          {this.nativeScrollBar ? (
            <div
              ref="scrollableElRef"
              style={[this.contentStyle]}
              class={`${mergedClsPrefix}-layout-scroll-container`}
            >
              {this.$slots}
            </div>
          ) : null}
        </div>
      )
    }
  })

export default createLayoutComponent(false)
