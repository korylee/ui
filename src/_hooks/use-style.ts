import { useSsrAdapter } from '@css-render/vue3-ssr'
import type { CNode } from 'css-render'
import { inject, onBeforeMount, Ref } from 'vue'
import { configProviderInjectionKey } from '../config-provider/src/context'
import { cssrAnchorMetaName } from './common'
import globalStyle from '../_styles/global/index.cssr'

export default function useStyle(
  mountId: string,
  style: CNode,
  clsPrefixRef?: Ref<string | undefined>
) {
  const configProvider = inject(configProviderInjectionKey, null)
  const ssrAdapter = useSsrAdapter()
  const mountStyle = (): void => {
    const clsPrefix = clsPrefixRef?.value
    style.mount({
      id: clsPrefix === undefined ? mountId : `${clsPrefix}-${mountId}`,
      head: true,
      anchorMetaName: cssrAnchorMetaName,
      props: {
        bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined
      },
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
