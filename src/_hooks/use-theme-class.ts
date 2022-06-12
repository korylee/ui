import { useSsrAdapter } from '@css-render/vue3-ssr'
import { hash } from 'css-render'
import { ComputedRef, CSSProperties, inject, ref, Ref, watchEffect } from 'vue'
import { configProviderInjectionKey } from '../config-provider/src/context'
import { c } from '../_utils'

export default function useThemeClass(
  componentName: string,
  hashRef: Ref<string> | undefined,
  cssVarsRef: ComputedRef<CSSProperties>,
  props: { themeOverrides?: unknown; builtinThemeOverrides?: unknown }
) {
  const mergedThemeHashRef = inject(
    configProviderInjectionKey,
    null
  )?.mergedThemeHashRef
  const themeClassRef = ref('')
  const ssrAdapter = useSsrAdapter()
  const hashClassPrefix = `__${componentName}`
  let renderCallback: (() => void) | undefined = undefined

  const mountStyle = (): void => {
    const { themeOverrides, builtinThemeOverrides } = props
    let finalThemeHash = hashClassPrefix
    const hashValue = hashRef?.value
    const themeHash = mergedThemeHashRef?.value
    console.log(themeHash);

    if (themeHash) finalThemeHash += `-${themeHash}`
    if (hashValue) finalThemeHash += `-${hashValue}`
    if (themeOverrides)
      finalThemeHash += `-${hash(JSON.stringify(themeOverrides))}`
    if (builtinThemeOverrides)
      finalThemeHash += `-${hash(JSON.stringify(builtinThemeOverrides))}`
    themeClassRef.value = finalThemeHash
    renderCallback = () => {
      const cssVars = cssVarsRef.value
      let style = ''
      for (const key in cssVars) {
        style += `${key}: ${(cssVars as any)[key]};`
      }
      c(`.${finalThemeHash}`, style).mount({
        id: finalThemeHash,
        ssr: ssrAdapter
      })
      renderCallback = undefined
    }
  }

  watchEffect(mountStyle)
  return {
    themeClass: themeClassRef,
    onRender: (): void => renderCallback?.()
  }
}
