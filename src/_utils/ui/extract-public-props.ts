import { ExtractPropTypes } from 'vue'
import useTheme from '../../_hooks/use-theme'

type ThemePropKeys = keyof typeof useTheme.props

export type ExtractPublicPropTypes<T> = Omit<
  Partial<ExtractPropTypes<T>>,
  | Exclude<ThemePropKeys, 'themeOverrides'>
  | Extract<keyof T, `internall${string}`>
>
