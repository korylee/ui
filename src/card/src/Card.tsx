import { CSSProperties, defineComponent, PropType, h } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import {
  ExtractPublicPropTypes,
  keyof,
  MaybeArray,
  resolveWrappedSlot
} from '../../_utils'
import { CardTheme } from '../styles/light'

export interface Segmented {
  content?: boolean | 'soft'
  footer?: boolean | 'soft'
  action?: boolean | 'soft'
}
export const cardBaseProps = {
  title: String,
  contentStyle: [Object, String] as PropType<CSSProperties | string>,
  headerStyle: [Object, String] as PropType<CSSProperties | string>,
  headerExtraStyle: [Object, String] as PropType<CSSProperties | string>,
  footerStyle: [Object, String] as PropType<CSSProperties | string>,
  embedded: Boolean,
  segmented: {
    type: [Boolean, Object] as PropType<boolean | Segmented>
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large' | 'huge'>,
    default: 'medium'
  },
  bordered: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: false
  },
  hoverable: Boolean,
  role: String,
  onClose: [Function, Array] as PropType<MaybeArray<() => void>>
} as const

export const cardBasePropsKeys = keyof(cardBaseProps)

const cardProps = {
  ...(useTheme.props as ThemeProps<CardTheme>),
  ...cardBaseProps
}

export type CardProps = ExtractPublicPropTypes<typeof cardProps>

export default defineComponent({
  name: 'Card',
  props: cardProps,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    return { mergedClsPrefix: mergedClsPrefixRef }
  },
  render() {
    const { mergedClsPrefix, $slots } = this
    return (
      <div class={[`${mergedClsPrefix}-card`]} role={this.role}>
        {resolveWrappedSlot($slots.header, (children) =>
          children || this.title || this.closable ? (
            <div
              class={`${mergedClsPrefix}-card-header`}
              style={this.headerStyle}
            >
              <div
                class={`${mergedClsPrefix}-card-header__main`}
                role="heading"
              >
                {children || this.title}
              </div>
              {resolveWrappedSlot(
                $slots['header-extra'],
                (children) =>
                  children && (
                    <div
                      class={[`${mergedClsPrefix}-card-header__extra`]}
                      style={this.headerExtraStyle}
                    >
                      {children}
                    </div>
                  )
              )}
              {}
            </div>
          ) : null
        )}
        {resolveWrappedSlot(
          $slots.default,
          (children) =>
            children && (
              <div
                style={this.contentStyle}
                class={`${mergedClsPrefix}-card__content`}
                role="none"
              >
                {children}
              </div>
            )
        )}
        {resolveWrappedSlot(
          $slots.footer,
          (children) =>
            children && (
              <div class={`${mergedClsPrefix}-card__action`} role="none">
                {children}
              </div>
            )
        )}
      </div>
    )
  }
})
