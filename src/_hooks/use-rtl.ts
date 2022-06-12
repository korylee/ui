import type { RtlEnabledState } from '../config-provider/src/internal-interface'

import { computed, onBeforeMount, Ref, watchEffect } from 'vue'
import { useSsrAdapter } from '@css-render/vue3-ssr'
import { exists } from 'css-render'
import { cssrAnchorMetaName } from './common'

export default function useRtl(
  mountId: string,
  rtlStateRef: Ref<undefined | RtlEnabledState> | undefined,
  clsPrefixRef: Ref<string>
) {
  if (!rtlStateRef) return undefined
  const ssrAdapter = useSsrAdapter()
  const componentRtlStateRef = computed(() => {
    const rtlState = rtlStateRef.value
    if (!rtlState) return undefined
    const componentRtlState = rtlState[mountId as keyof RtlEnabledState]
    if (!componentRtlState) return undefined
    return componentRtlState
  })
  const mountStyle = () => {
    watchEffect(() => {
      const clsPrefix = clsPrefixRef.value
      const id = `${clsPrefix}${mountId}Rtl`
      if (exists(id, ssrAdapter)) return
      const componentRtlState = componentRtlStateRef.value
      if (!componentRtlState) return
      componentRtlState.style.mount({
        id,
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
        },
        ssr: ssrAdapter
      })
    })
  }
  if (ssrAdapter) mountStyle()
  else onBeforeMount(mountStyle)

  return componentRtlStateRef
}
