import { computed, ref } from 'vue'
import { useMemo } from 'vooks'
import { i18n, useIsMobile } from '../utils/composables'
import hljs from './hljs'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

let currentRouter = null
let currentRoute = null
let localeNameRef = null
let dateLocaleRef = null

export function initRouter(router, route) {
  currentRoute = route
  currentRouter = router
  localeNameRef = useMemo({
    get: () => (route.path.startsWith('/zh-CN') ? 'zh-CN' : 'en-US'),
    set(locale) {
      router.push(changeLangInPath(route.fullPath, locale))
    }
  })
  dateLocaleRef = useMemo(() => route.path.startsWith('/zh-CN'))
}

const _displayModeRef = ref(window.localStorage.getItem('mode') ?? 'debug')
const displayModeRef = computed({
  get: () => _displayModeRef.value,
  set: (val) => {
    _displayModeRef.value = val
    window.localStorage.setItem('mode', val)
  }
})

export const useDisplayMode = () => displayModeRef

function changeLangInPath(path, lang) {
  const langReg = /^\/(zh-CN|en-US)\//
  return path.replace(langReg, `/${lang}/`)
}

export function siteSetup() {
  i18n.provide(computed(() => localeNameRef?.value))
  const isMobileRef = useIsMobile()
  initRouter(useRouter(), useRoute())

  return {
    hljs,
    themeEditorStyle: computed(() =>
      isMobileRef.value ? 'right:18px;bottom: 24px' : undefined
    )
  }
}
