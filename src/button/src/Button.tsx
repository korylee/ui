import type { ButtonSize, ButtonType } from './interface'

import { defineComponent, h, PropType, ref } from 'vue'
import { ThemeProps, useConfig, useTheme } from '../../_hooks'
import {
  call,
  ExtractPublicPropTypes,
  MaybeArray,
  resolveWrappedSlot
} from '../../_utils'
import { ButtonTheme } from '../styles'

const buttonProps = {
  ...(useTheme.props as ThemeProps<ButtonTheme>),
  color: String,
  textColor: String,
  text: Boolean,
  block: Boolean,
  loading: Boolean,
  disabled: Boolean,
  circle: Boolean,
  size: String as PropType<ButtonSize>,
  ghost: Boolean,
  round: Boolean,
  secondary: Boolean,
  tertiary: Boolean,
  strong: Boolean,
  focusable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  tag: {
    type: String as PropType<keyof HTMLElementTagNameMap>,
    default: 'button'
  },
  dashed: Boolean,
  type: {
    type: String as PropType<ButtonType>,
    default: 'default'
  },
  attrType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  iconPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  bordered: {
    type: Boolean,
    default: true
  },
  onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  nativeFocusBehavior: Boolean
} as const

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>

export default defineComponent({
  name: 'Button',
  props: buttonProps,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    const selfElRef = ref<HTMLElement | null>(null)
    const waveElRef = ref(null)

    const handleClick = (e: MouseEvent): void => {
      if (props.disabled || props.loading) return
      const { onClick } = props
      if (onClick) call(onClick, e)
      if (!props.text) waveElRef.value?.play()
    }
    return { selfElRef, mergedClsPrefix: mergedClsPrefixRef, handleClick }
  },
  render() {
    const { mergedClsPrefix } = this
    const children = resolveWrappedSlot(
      this.$slots.default,
      (children) =>
        children && (
          <span class={`${mergedClsPrefix}-button__content`}>{children}</span>
        )
    )
    return (
      <this.tag
        ref="selfElRef"
        class={[
          `${mergedClsPrefix}-button`,
          `${mergedClsPrefix}-button--${this.type}-type`
        ]}
        type={this.attrType}
        disabled={this.disabled}
        onClick={this.handleClick}
      >
        {children}
      </this.tag>
    )
  }
})
