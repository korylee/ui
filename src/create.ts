import { App } from 'vue'
import version from './version'

type ComponentType = any

export interface UiInstance {
  version: string
  componentPrefix: string
  install: (app: App) => void
}

interface UiCreateOptions {
  components?: ComponentType[]
  componentPrefix?: string
}

function registerComponent(
  app: App,
  name: string,
  component: ComponentType
): void {
  const registered = app.component(name)
  if (!registered) {
    app.component(name, component)
  }
}
export default function create({
  componentPrefix = 'K',
  components = []
}: UiCreateOptions = {}): UiInstance {
  const installTargets: App[] = []

  function install(app: App): void {
    if (installTargets.includes(app)) return
    installTargets.push(app)
    components.forEach((component) => {
      const { name, alias } = component
      registerComponent(app, componentPrefix + (name as string), component)
      if (alias) {
        alias.forEach((alia: string) => {
          registerComponent(app, componentPrefix + alia, component)
        })
      }
    })
  }
  return {
    install,
    componentPrefix,
    version
  }
}
