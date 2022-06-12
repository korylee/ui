import type { ButtonSize, ButtonType } from './interface'

import { computed, CSSProperties, defineComponent, h, PropType, ref } from 'vue'
import {
  ThemeProps,
  useConfig,
  useRtl,
  useTheme,
  useThemeClass
} from '../../_hooks'
import {
  call,
  createHoverColor,
  createKey,
  ExtractPublicPropTypes,
  MaybeArray,
  resolveWrappedSlot,
  createPressedColor,
  colorToClass
} from '../../_utils'
import { buttonLight, ButtonTheme } from '../styles'
import { BaseWaveRef, BaseWave } from '../../_internal'
import { useMemo } from 'vooks'
import style from './styles/index.cssr'

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
  quaternary: Boolean,
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
  bordered: { type: Boolean, default: true },
  onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  nativeFocusBehavior: Boolean
} as const

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>

export default defineComponent({
  name: 'Button',
  props: buttonProps,
  setup(props) {
    const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } =
      useConfig(props)
    const selfElRef = ref<HTMLElement | null>(null)
    const waveElRef = ref<BaseWaveRef | null>(null)
    const enterPressedRef = ref(false)
    const showBorderRef = useMemo(
      () =>
        !props.quaternary &&
        !props.tertiary &&
        !props.secondary &&
        !props.text &&
        (!props.color || props.ghost || props.dashed) &&
        props.bordered
    )
    const mergedSizeRef = computed(() => props.size ?? 'medium')
    const mergedFocusableRef = computed(
      () => props.focusable && !props.disabled
    )
    const rtlEnabledRef = useRtl('Button', mergedRtlRef, mergedClsPrefixRef)
    const themeRef = useTheme(
      'Button',
      'button',
      style,
      buttonLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed((): CSSProperties => {
      const {
        strong,
        type,
        text,
        ghost,
        dashed,
        color,
        textColor,
        circle,
        round
      } = props
      const {
        common: { cubicBezierEaseInOut, cubicBezierEaseOut },
        self
      } = themeRef.value
      const size = mergedSizeRef.value
      const typeIsTertiary = type === 'tertiary'
      const typeIsDefault = type === 'default'
      const mergedType = typeIsTertiary ? 'default' : type
      const {
        rippleDuration,
        waveOpacity,
        opacityDisabled,
        fontWeight,
        fontWeightStrong,
        // size
        [createKey('height', size)]: height,
        [createKey('fontSize', size)]: fontSize,
        [createKey('borderRadius', size)]: borderRadius,
        [createKey('padding', size)]: padding,
        [createKey('paddingRound', size)]: paddingRound,
        [createKey('iconSize', size)]: iconSize,
        [createKey('iconMargin', size)]: iconMargin,
        //border
        [createKey('border', mergedType)]: border,
        // color
        textColorPrimary
      } = self

      //border
      const borderProps = text
        ? {
            '--k-border': 'none',
            '--k-border-hover': 'none'
          }
        : { '--k-border': border }
      // size
      const sizeProps = {
        '--k-width': circle && !text ? height : 'initial',
        '--k-height': text ? 'initial' : height,
        '--k-font-size': fontSize,
        '--k-padding':
          circle || text ? 'initial' : round ? paddingRound : padding,
        '--k-border-radius': text
          ? 'initial'
          : circle || round
          ? height
          : borderRadius,
        '--k-icon-size': iconSize,
        '--k-icon-margin': iconMargin
      }

      const colorProps = (() => {
        if (text) {
          const propTextColor = textColor || color
          const mergedTextColor =
            propTextColor || self[createKey('textColorText', mergedType)]
          return {
            '--k-color': '#0000',
            '--k-color-hover': '#0000'
          }
        }
        if (ghost || dashed) {
          const mergedTextColor = textColor || color
          return {}
        }
        return {
          '--k-color': color || self[createKey('color', mergedType)],
          '--k-color-hover': color
            ? createHoverColor(color)
            : self[createKey('colorHover', mergedType)],
          '--k-color-pressed': color
            ? createPressedColor(color)
            : self[createKey('colorPressed', mergedType)]
        }
      })()

      return {
        '--k-bezier': cubicBezierEaseInOut,
        '--k-bezier-ease-out': cubicBezierEaseOut,
        '--k-ripple-duration': rippleDuration,
        '--k-wave-opacity': waveOpacity,
        '--k-opacity-disabled': opacityDisabled,
        '--k-font-weight': strong ? fontWeightStrong : fontWeight,
        ...sizeProps,
        ...colorProps,
        ...borderProps
      }
    })
    const themeClassHandler = inlineThemeDisabled
      ? useThemeClass(
          'button',
          computed(() => {
            let hash = ''
            const {
              dashed,
              ghost,
              text,
              round,
              circle,
              secondary,
              tertiary,
              quaternary,
              strong,
              color,
              textColor,
              type
            } = props
            const { value: size } = mergedSizeRef
            if (dashed) hash += 'a'
            if (ghost) hash += 'b'
            if (text) hash += 'c'
            if (round) hash += 'd'
            if (circle) hash += 'e'
            if (secondary) hash += 'f'
            if (tertiary) hash += 'g'
            if (quaternary) hash += 'h'
            if (strong) hash += 'i'
            if (color) hash += 'j' + colorToClass(color)
            if (textColor) hash += 'k' + colorToClass(textColor)
            hash += 'l' + size[0]
            hash += 'm' + type[0]
            return hash
          }),
          cssVarsRef,
          props
        )
      : undefined

    const handleMousedown = (e: MouseEvent) => {
      if (props.nativeFocusBehavior) return
      e.preventDefault()
      if (props.disabled) return
      if (!mergedClsPrefixRef.value) return
      selfElRef.value?.focus({ preventScroll: true })
    }
    const handleClick = (e: MouseEvent): void => {
      const { onClick } = props
      if (props.disabled || props.loading) return
      if (onClick) call(onClick, e)
      if (!props.text) waveElRef.value?.play()
    }
    const handleBlur = () => {
      enterPressedRef.value = false
    }
    const handleKeyup = (e: KeyboardEvent): void => {
      if (e.key !== 'Enter') return
      if (!props.keyboard) return
      enterPressedRef.value = false
    }
    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key !== 'Enter') return
      if (!props.keyboard || props.loading) {
        e.preventDefault()
        return
      }
      enterPressedRef.value = true
    }

    return {
      selfElRef,
      waveElRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedFocusable: mergedFocusableRef,
      showBorder: showBorderRef,
      mergedSize: mergedSizeRef,
      enterPressed: enterPressedRef,
      rtlEnabled: rtlEnabledRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      customColorCssVars: computed(() => {
        const { color } = props
        if (!color) return undefined
        const hoverColor = createHoverColor(color)
        return {
          '--k-border-color': color,
          '--k-border-color-hover': hoverColor,
          '--k-border-color-pressed': createPressedColor(color),
          '--k-border-color-focus': hoverColor,
          '--k-border-color-disabled': color
        } as CSSProperties
      }),

      handleClick,
      handleBlur,
      handleKeydown,
      handleKeyup,
      handleMousedown,
      themeClass: themeClassHandler?.themeClass,
      onRender: themeClassHandler?.onRender
    }
  },
  render() {
    const { mergedClsPrefix } = this
    this.onRender?.()
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
          this.themeClass,
          `${mergedClsPrefix}-button`,
          `${mergedClsPrefix}-button--${this.type}-type`,
          `${mergedClsPrefix}-button--${this.mergedSize}-type`,
          this.rtlEnabled && `${mergedClsPrefix}-button--rtl`,
          this.disabled && `${mergedClsPrefix}-button--disabled`,
          this.block && `${mergedClsPrefix}-button--block`,
          this.enterPressed && `${mergedClsPrefix}-button--pressed`,
          !this.text && this.dashed && `${mergedClsPrefix}-button--dashed`,
          this.color && `${mergedClsPrefix}-button-color`,
          this.secondary && `${mergedClsPrefix}-button--secondary`,
          this.loading && `${mergedClsPrefix}-button--loading`,
          this.ghost && `${mergedClsPrefix}-buttin--ghost`
        ]}
        style={this.cssVars}
        tabindex={this.mergedFocusable ? 0 : -1}
        type={this.attrType}
        disabled={this.disabled}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyup={this.handleKeyup}
        onKeydown={this.handleKeydown}
        onMousedown={this.handleMousedown}
      >
        {this.iconPlacement === 'right' && children}
        {}
        {this.iconPlacement === 'left' && children}
        {!this.text && <BaseWave clsPrefix={mergedClsPrefix} ref="waveElRef" />}
        {this.showBorder && (
          <div
            aria-hidden
            class={`${mergedClsPrefix}-button__border`}
            style={this.customColorCssVars}
          />
        )}
        {this.showBorder && (
          <div
            aria-hidden
            class={`${mergedClsPrefix}-button__state-border`}
            style={this.customColorCssVars}
          />
        )}
      </this.tag>
    )
  }
})
