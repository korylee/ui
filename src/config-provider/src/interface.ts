import {
  ExtractThemeOverrides,
  PartialExtractThemeOverrides
} from '../../_hooks/use-theme'
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
