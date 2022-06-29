import { existsSync, writeFile } from 'fs-extra'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import * as globalComponents from '../src/components'

const excludeComponents = ['XButton']
const exist = (path) => existsSync(path)

function parseComponentsDeclarations(code) {
  if (!code) return {}
  return Object.fromEntries(
    Array.from(code.matchAll(/(?<!\/\/)\s+\s+['"]?(.+?)['"]?:\s(.+?)\n/g)).map(
      (i) => [i[1], i[2]]
    )
  )
}

async function generateComponentsType() {
  const components = {}
  Object.keys(globalComponents).forEach((key) => {
    console.log(key)
    if (excludeComponents.includes(key)) return
    components[key] = `typeof import('@korylee/ui')['${key}']`
  })
  // const originalContent = exist(currentPath)
  //   ? await readFile(currentPath, 'utf-8')
  //   : ''
  // const originImports =parseComponentsDeclarations(originalContent)
  const lines = Object.entries(components).map(([name, v]) => {
    if (!/^\w+$/.test(name)) name = `'${name}'`
    return `${name}: ${v}`
  })
  const code = `//Auto generated components declarations
declare module 'vue' {
  export interface GlobalComponents {
    ${lines.join('\n    ')}
  }
}
export {}
  `
  writeFile(resolve(cwd(), 'volar.d.ts'), code, 'utf-8')
}
generateComponentsType()
