import type { GlobalTheme, GlobalThemeOverrides } from './interface'
import type {
  Breakpoints,
  GlobalComponentConfig,
  GlobalIconConfig,
  RtlEnabledState,
  RtlItems
} from './internal-interface'
import type { CommonLocale, DateLocale } from '../../locales'

import { merge } from 'lodash-es'
import {
  defineComponent,
  ExtractPropTypes,
  PropType,
  h,
  inject,
  computed,
  markRaw,
  provide
} from 'vue'
import { defaultClsPrefix, Hljs } from '../../_hooks'
import { configProviderInjectionKey } from './context'
import { useMemo } from 'vooks'
import { hash } from 'css-render'

export const configProviderProps = {
  abstract: Boolean,
  bordered: {
    type: Boolean,
    default: undefined
  },
  clsPrefix: String,
  locale: Object as PropType<CommonLocale | null>,
  dateLocale: Object as PropType<DateLocale | null>,
  namespace: String,
  rtl: Array as PropType<RtlItems>,
  tag: {
    type: String,
    default: 'div'
  },
  hljs: Object as PropType<Hljs>,
  theme: Object as PropType<GlobalTheme | null>,
  themeOverrides: Object as PropType<GlobalThemeOverrides | null>,
  componentOptions: Object as PropType<GlobalComponentConfig>,
  icons: Object as PropType<GlobalIconConfig>,
  breakpoints: Object as PropType<Breakpoints>,
  preflightStyleDisabled: Boolean,
  inlineThemeDisabled: {
    type: Boolean,
    default: undefined
  }
} as const

export type ConfigProviderProps = Partial<
  ExtractPropTypes<typeof configProviderProps>
>

export default defineComponent({
  name: 'ConfigProvider',
  alias: ['App'],
  props: configProviderProps,
  setup(props) {
    const configProvider = inject(configProviderInjectionKey, null)
    const mergedThemeRef = computed(() => {
      const { theme } = props
      if (theme === null) return undefined
      const inheritedTheme = configProvider?.mergedThemeRef.value
      return theme === undefined
        ? inheritedTheme
        : inheritedTheme === undefined
        ? theme
        : { ...inheritedTheme, ...theme }
    })
    const mergedThemeOverridesRef = computed(() => {
      const { themeOverrides } = props
      if (themeOverrides === null) return undefined
      else if (themeOverrides === undefined)
        return configProvider?.mergedThemeOverridesRef.value
      const inheritedThemeOverrides =
        configProvider?.mergedThemeOverridesRef.value
      if (inheritedThemeOverrides === undefined) return themeOverrides
      return merge({}, inheritedThemeOverrides, themeOverrides)
    })

    const mergedNamespaceRef = useMemo(() => {
      const { namespace } = props
      return namespace === undefined
        ? configProvider?.mergedNamespaceRef.value
        : namespace
    })
    const mergedBorderedRef = useMemo(
      () => props.bordered ?? configProvider?.mergedBorderedRef.value
    )
    const mergedIconsRef = computed(() => {
      return props.icons ?? configProvider?.mergedIconsRef.value
    })

    const mergedComponentPropsRef = computed(
      () =>
        props.componentOptions ?? configProvider?.mergedComponentPropsRef.value
    )

    const mergedClsPrefixRef = computed(
      () => props.clsPrefix ?? configProvider?.mergedClsPrefixRef.value
    )
    const mergedRtlRef = computed((): RtlEnabledState | undefined => {
      const { rtl } = props
      if (rtl === undefined) return configProvider?.mergedRtlRef.value
      return rtl.reduce((acc, cur) => {
        acc[cur.name] = markRaw(cur)
        cur.peers?.forEach((peerRtlInfo) => {
          if (peerRtlInfo.name in acc) return
          acc[peerRtlInfo.name] = markRaw(peerRtlInfo)
        })
        return acc
      }, {} as RtlEnabledState)
    })
    const mergedBreakpointsRef = computed(
      () => props.breakpoints ?? configProvider?.mergedBreakpointsRef.value
    )

    const inlineThemeDisabled =
      props.inlineThemeDisabled ?? configProvider?.inlineThemeDisabled ?? false
    const preflightStyleDisabled =
      props.preflightStyleDisabled ??
      configProvider?.preflightStyleDisabled ??
      false
    const mergedThemeHashRef = computed(() => {
      const theme = mergedThemeRef.value
      const mergedThemeOverrides = mergedThemeOverridesRef.value
      const hasThemeOverrides =
        mergedThemeOverrides && !Object.keys(mergedThemeOverrides).length
      const themeName = theme?.name
      const hashMergedThemeOverrides = hash(
        JSON.stringify(mergedThemeOverrides)
      )
      if (themeName) {
        if (hasThemeOverrides) return `${themeName}-${hashMergedThemeOverrides}`
        return themeName
      }
      if (hasThemeOverrides) return hashMergedThemeOverrides
      return ''
    })
    const mergedLocaleRef = computed(() => {
      const { locale } = props
      if (locale === null) return undefined
      return locale ?? configProvider?.mergedLocaleRef.value
    })
    const mergedDateLocaleRef = computed(() => {
      const { dateLocale } = props
      if (dateLocale === null) return undefined
      return dateLocale === undefined
        ? configProvider?.mergedDateLocaleRef.value
        : dateLocale
    })
    const mergedHljsRef = computed(() => {
      const { hljs } = props
      return hljs === undefined ? configProvider?.mergedHljsRef.value : hljs
    })

    provide(configProviderInjectionKey, {
      mergedThemeHashRef,
      mergedBreakpointsRef,
      mergedRtlRef,
      mergedIconsRef,
      mergedComponentPropsRef,
      mergedBorderedRef,
      mergedNamespaceRef,
      mergedClsPrefixRef,
      mergedLocaleRef,
      mergedDateLocaleRef,
      mergedHljsRef,
      mergedThemeRef,
      mergedThemeOverridesRef,
      inlineThemeDisabled,
      preflightStyleDisabled
    })
    return {
      mergedClsPrefix: mergedClsPrefixRef
    }
  },
  render() {
    if (this.abstract) return this.$slots.default?.()
    const clazz = `${this.mergedClsPrefix || defaultClsPrefix}-config-provider`
    return h(this.tag, { class: clazz }, this.$slots.default?.())
  }
})
