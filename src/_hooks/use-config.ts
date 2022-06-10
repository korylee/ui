import { computed, ComputedRef, inject, Ref } from 'vue'
import { configProviderInjectionKey } from '../config-provider/src/context'
import {
  Breakpoints,
  GlobalComponentConfig,
  RtlEnabledState
} from '../config-provider/src/internal-interface'

type UseConfigProps = Readonly<{
  bordered?: boolean
  [key: string]: unknown
}>

interface ConfigResult {
  inlineThemeDisabled: boolean | undefined
  mergedRtlRef: Ref<RtlEnabledState | undefined> | undefined
  mergedBorderedRef: ComputedRef<boolean>
  mergedClsPrefixRef: ComputedRef<string>
  mergedBreakpointsRef: Ref<Breakpoints> | undefined
  mergedComponentPropsRef: Ref<GlobalComponentConfig | undefined> | undefined
  namespaceRef: ComputedRef<string | undefined>
}

export const defaultClsPrefix = 'k'

export default function useConfig(
  props: UseConfigProps = {},
  { defaultBordered = true } = {}
): ConfigResult {
  const ConfigProvider = inject(configProviderInjectionKey, null)
  return {
    inlineThemeDisabled: ConfigProvider?.inlineThemeDisabled,
    mergedRtlRef: ConfigProvider?.mergedRtlRef,
    mergedComponentPropsRef: ConfigProvider?.mergedComponentPropsRef,
    mergedBreakpointsRef: ConfigProvider?.mergedBreakpointsRef,
    mergedBorderedRef: computed(
      () =>
        props.bordered ??
        ConfigProvider?.mergedBorderedRef.value ??
        defaultBordered ??
        true
    ),
    mergedClsPrefixRef: computed(
      () => ConfigProvider?.mergedClsPrefixRef.value || defaultClsPrefix
    ),
    namespaceRef: computed(() => ConfigProvider?.mergedNamespaceRef.value)
  }
}
