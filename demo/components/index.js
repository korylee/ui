import 'vfonts/Inter.css'
import 'vfonts/FiraCode.css'
import ComponentDemo from './ComponentDemo.vue'
import ComponentDemos from './ComponentDemos'

export function installDemoComponents(app) {
  app.component(ComponentDemo.name, ComponentDemo)
  app.component(ComponentDemos.name, ComponentDemos)
}
