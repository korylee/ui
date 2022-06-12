import type { CNode } from 'css-render'
import type { Ref, VNodeChild } from 'vue'
import type { ButtonTheme } from '../../button/styles'
import type { LayoutTheme } from '../../layout/styles'
import type { TypographyTheme } from '../../typogrphy/styles'
import type { UploadTheme } from '../../upload/styles'
import type { CommonLocale, DateLocale } from '../../locales'
import type { Hljs } from '../../_hooks'
import type { GlobalTheme } from './interface'

export interface GlobalIconConfig {
  attach?: () => VNodeChild
}

export interface RtlItem {
  name: keyof GlobalThemeWithoutCommon
  style: CNode
  peers?: RtlItem[]
}

export type RtlItems = RtlItem[]

export interface GlobalThemeWithoutCommon {
  Layout?: LayoutTheme
  Typography?: TypographyTheme
  Button?: ButtonTheme
  Upload?: UploadTheme
}

export type RtlEnabledState = Partial<
  Record<keyof GlobalThemeWithoutCommon, RtlItem>
>

export type Breakpoints = { [k: string]: number } | undefined

export interface GlobalComponentConfig {
  Pagination?: {
    // inputSize?: InputSize
  }
}

export interface ConfigProviderInjection {
  mergedBreakpointsRef: Ref<Breakpoints | undefined>
  mergedClsPrefixRef: Ref<string | undefined>
  mergedBorderedRef: Ref<boolean | undefined>
  mergedNamespaceRef: Ref<string | undefined>
  mergedLocaleRef: Ref<CommonLocale | undefined>
  mergedDateLocaleRef: Ref<DateLocale | undefined>
  mergedHljsRef: Ref<Hljs | undefined>
  mergedComponentPropsRef: Ref<GlobalComponentConfig | undefined>
  mergedIconsRef: Ref<GlobalIconConfig | undefined>
  mergedThemeRef: Ref<GlobalTheme | undefined>
  mergedThemeOverridesRef: Ref<GlobalThemeOverrides | undefined>
  mergedRtlRef: Ref<RtlEnabledState | undefined>
  mergedThemeHashRef: Ref<string>
  // non-reactive
  inlineThemeDisabled: boolean
  preflightStyleDisabled: boolean
}
