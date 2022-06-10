import { useBreakpoint, useMemo } from 'vooks'
import { inject, computed, reactive, watchEffect, provide } from 'vue'

export function useIsMobile() {
  const breakpointRef = useBreakpoint()
  return useMemo(() => breakpointRef.value === 'xs')
}

export function i18n(data) {
  const localeReactive = inject('i18n', null)
  const locale = computed(() => localeReactive?.locale ?? 'zh-CN')
  return {
    locale,
    t: (key) => data[locale.value]?.[key]
  }
}

i18n.provide = (localeRef) => {
  const localeReactive = reactive({ locale: 'zh-CN' })
  watchEffect(() => {
    localeReactive.locale = localeRef.value
  })
  provide('i18n', localeReactive)
}
