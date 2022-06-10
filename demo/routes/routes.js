const enDocRoutes = []

const zhComponentRoutes = [
  {
    path: 'upload',
    component: () => import('../../src/upload/demos/zhCN/index.demo-entry.md')
  }
]

const LAYOUT = () => import('../pages/Layout.vue')

export const routes = [
  {
    name: 'home',
    path: '/:lang/:theme',
    component: () => import('../pages/home/index.vue')
  },
  {
    name: 'enDocs',
    path: '/en-US/:theme/docs',
    component: LAYOUT,
    children: enDocRoutes
  },
  {
    name: 'zhComponents',
    path: '/zh-CN/:theme/components',
    component: LAYOUT,
    children: zhComponentRoutes
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: LAYOUT,
    redirect: {
      name: 'home',
      params: {
        lang: navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US',
        theme: 'os-theme'
      }
    }
  }
]

export default routes
