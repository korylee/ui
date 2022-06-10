import { createApp } from 'vue'
import ui from 'kory-ui'
import { installDemoComponents } from './components'
import SiteRoot from './SiteRoot.vue'
import router from './routes/router'

const app = createApp(SiteRoot)
app.use(router)
app.use(ui)
installDemoComponents(app)

router.isReady().then(() => app.mount('#app'))
