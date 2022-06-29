import { CNode } from 'css-render'
import {
  computed,
  ComputedRef,
  inject,
  onBeforeMount,
  PropType,
  Ref
} from 'vue'
import { GlobalTheme } from '../config-provider'
import type { ThemeCommonVars } from '../_styles/common'
import { useSsrAdapter } from '@css-render/vue3-ssr'
import { cssrAnchorMetaName } from './common'
import { configProviderInjectionKey } from '../config-provider/src/context'
import { merge } from 'lodash-es'
import globalStyle from '../_styles/global/index.cssr'

export interface ThemeType<N, T = {}, R = any> {
  name: N
  common?: ThemeCommonVars
  peers?: R
  self?: (vars: ThemeCommonVars) => T
}

export interface ThemeProps<T> {
  theme: PropType<T>
  themeOverrides: PropType<ExtractThemeOverrides<T>>
  builtinThemeOverrides: PropType<ExtractThemeOverrides<T>>
}

export type ExtractThemeVars<T> = T extends ThemeType<unknown, infer U, unknown>
  ? unknown extends U
    ? {}
    : U
  : {}

export type ExtractPeerOverrides<T> = T extends ThemeType<
  unknown,
  unknown,
  infer V
>
  ? {
      peers?: { [k in keyof V]?: ExtractPeerOverrides<V[k]> }
    }
  : T

export type ExtractMergedPeerOverrides<T> = T extends ThemeType<
  unknown,
  unknown,
  infer V
>
  ? { [k in keyof V]?: ExtractPeerOverrides<V[k]> }
  : T

export type ExtractThemeOverrides<T> = Partial<ExtractThemeVars<T>> &
  ExtractPeerOverrides<T> & { common?: ThemeCommonVars }

export type PartialExtractThemeOverrides<T> = {
  [key in keyof T]?: ExtractThemeOverrides<T[key]>
}

type UseThemeProps<T> = Readonly<{
  theme?: T | undefined
  themeOverrides?: ExtractThemeOverrides<T>
  builtinThemeOverrides?: ExtractThemeOverrides<T>
}>

export type MergedTheme<T> = T extends ThemeType<unknown, infer V, infer W>
  ? {
      common: ThemeCommonVars
      self: V
      peers: W
      peerOverrides: ExtractMergedPeerOverrides<T>
    }
  : T

export function createTheme<N extends string, T, R>(
  theme: ThemeType<N, T, R>
): ThemeType<N, T, R> {
  return theme
}

function useTheme<N, T, R>(
  resolveId: Exclude<keyof GlobalTheme, 'common' | 'name'>,
  mountId: string,
  style: CNode | undefined,
  defaultTheme: ThemeType<N, T, R>,
  props: UseThemeProps<ThemeType<N, T, R>>,
  clsPrefixRef?: Ref<string | undefined>
): ComputedRef<MergedTheme<ThemeType<N, T, R>>> {
  const configProvider = inject(configProviderInjectionKey, null)
  if (style) {
    const ssrAdapter = useSsrAdapter()
    const mountStyle = (): void => {
      const clsPrefix = clsPrefixRef?.value
      style.mount({
        id: clsPrefix === undefined ? mountId : `${clsPrefix}-${mountId}`,
        head: true,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
        },
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter
      })

      if (!configProvider?.preflightStyleDisabled) {
        globalStyle.mount({
          id: 'k-global',
          head: true,
          anchorMetaName: cssrAnchorMetaName,
          ssr: ssrAdapter
        })
      }
    }

    if (ssrAdapter) mountStyle()
    else onBeforeMount(mountStyle)
  }
  return computed(() => {
    const {
      theme: { common: selfCommon, self, peers: selfPeers = {} } = {},
      themeOverrides: selfOverrides = {} as ExtractThemeOverrides<
        ThemeType<N, T, R>
      >,
      builtinThemeOverrides: builtinOverrides = {} as ExtractThemeOverrides<
        ThemeType<N, T, R>
      >
    } = props
    const { common: selfCommonOverrides, peers: selfPeersOverrides } =
      selfOverrides
    const {
      common: globalCommon = undefined,
      [resolveId]: {
        common: globalSelfCommon = undefined,
        peers: globalPeers = {},
        self: globalSelf = undefined
      } = {}
    } = configProvider?.mergedThemeRef.value || {}
    const {
      common: globalCommonOverrides = undefined,
      [resolveId]: globalSelfOverrides = {}
    } = configProvider?.mergedThemeOverridesRef.value || {}
    const {
      common: globalSelfCommonOverrides,
      peers: globalPeersOverrides = {}
    } = globalSelfOverrides
    const mergedCommon = merge(
      {},
      selfCommon || globalSelfCommon || globalCommon || defaultTheme.common,
      globalCommonOverrides,
      globalSelfCommonOverrides,
      selfCommonOverrides
    )
    const mergedSelf = merge(
      (self || globalSelf || defaultTheme.self)?.(mergedCommon) as T,
      builtinOverrides,
      globalSelfOverrides,
      selfOverrides
    )
    return {
      common: mergedCommon,
      self: mergedSelf,
      peers: merge({}, defaultTheme.peers, globalPeers, selfPeers),
      peerOverrides: merge(
        {},
        builtinOverrides.peers,
        globalPeersOverrides,
        selfPeersOverrides
      )
    }
  })
}

useTheme.props = {
  theme: Object,
  themeOverrides: Object,
  builtinThemeOverrides: Object
} as const

export default useTheme
