const zhDocs = import.meta.glob('../../src/*/docs/zhCN/index.demo-entry.md', {
  eager: true
})
const zhComponents = import.meta.glob(
  '../../src/*/demos/zhCN/index.demo-entry.md',
  { eager: true }
)

const getRoutes = (list, reg) =>
  Object.keys(list).map((path) => {
    const name = path.match(
      /\.\.\/\.\.\/src\/(.*)\/demos\/zhCN\/index\.demo-entry\.md$/
    )?.[1]
    return {
      name,
      path: name?.toLowerCase(),
      component: list[path].default
    }
  })

const zhDocRoutes = getRoutes(
  zhDocs,
  /\.\.\/\.\.\/src\/(.*)\/docs\/zhCN\/index\.demo-entry\.md$/
)
const zhComponentRoutes = getRoutes(
  zhComponents,
  /\.\.\/\.\.\/src\/(.*)\/demos\/zhCN\/index\.demo-entry\.md$/
)

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
    children: []
  },
  {
    name: 'zhDocs',
    path: '/zh-CN/:theme/docs',
    component: LAYOUT,
    children: zhDocRoutes
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
