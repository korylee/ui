import { nextTick } from 'vue'
import { createWebHistory } from 'vue-router'
import { createRouter } from 'vue-router'
import routes from './routes'

const loadingBarApiRef = {}

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if ((!from || to.path !== from.path) && loadingBarApiRef.value) {
    loadingBarApiRef.value.start()
  }
  next()
})

router.afterEach((to, from) => {
  if ((!from || to.path !== from.path) && loadingBarApiRef.value) {
    loadingBarApiRef.value.finish()
  }
  if (to.hash && to.hash !== from.hash) {
    nextTick(() => {
      const el = document.querySelector(to.hash)
      if (el) el.scrollIntoView()
    })
  }

  nextTick(() => {
    const h1s = document.getElementsByTagName('h1')

    if (to.name !== 'home' && h1s.length) {
      document.title = h1s[0].textContent
    } else {
      // @ts-ignore
      // window.deriveTitleFromLocale()
    }
  })
})

export default router
