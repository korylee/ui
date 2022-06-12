import type { PartialExtractThemeOverrides } from '../../_hooks'
import type { ThemeCommonVars } from '../../_styles/common'
import type { GlobalThemeWithoutCommon } from './internal-interface'

export interface CustomThemeCommonVars {}

export interface GlobalTheme extends GlobalThemeWithoutCommon {
  name: string
  common?: ThemeCommonVars
}

export type GlobalThemeOverrides = {
  common?: Partial<ThemeCommonVars & CustomThemeCommonVars>
} & PartialExtractThemeOverrides<GlobalThemeWithoutCommon>
