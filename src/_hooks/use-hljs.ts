import { HLJSApi } from 'highlight.js'
import { computed, ComputedRef, inject, Ref, watchEffect } from 'vue'
import { configProviderInjectionKey } from '../config-provider/src/context'
import { warn } from '../_utils'

export type Hljs = Pick<HLJSApi, 'highlight' | 'getLanguage'>

interface UseHljsProps {
  hljs?: unknown
  [key: string]: unknown
}

export default function useHljs(
  props: UseHljsProps,
  shouldHlRef?: Ref<boolean>
): ComputedRef<Hljs | undefined> {
  const configProvider = inject(configProviderInjectionKey, null)
  if (__IS_DEV__) {
    const warnHljs = () => {
      if (props.hljs) return
      if (configProvider?.mergedHljsRef.value) return
      warn('code', 'hljs is not set')
    }
    if (!shouldHlRef) warnHljs()
    else watchEffect(() => shouldHlRef.value && warnHljs())
  }
  return computed(() => (props.hljs as any) || configProvider?.mergedHljsRef.value)
}
