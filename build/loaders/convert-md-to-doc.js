import camelCase from 'lodash.camelcase'
import { marked } from 'marked'
import fsExtra from 'fs-extra'
import { projectPath } from '../utils/common'
import path from 'path'
import createRenderer from './md-renderer'

const mdRenderer = createRenderer()

async function resolveDemoInfos(literal, url, env) {
  const paths = literal
    .split('\n')
    .map((line) => line.trim())
    .filter((id) => id.length)
  const infos = []
  for (const path of paths) {
    const debug = path.includes('debug') || path.includes('Debug')
    if (env === 'production' && debug) continue
    let filename
    if (path.includes('.vue')) filename = path.slice(0, -4) + '.demo.vue'
    else filename = `${path}.demo.md`
    const variable = `${camelCase(path)}Demo`
    infos.push({
      id: path,
      variable,
      filename,
      title: await resolveDemoTitle(filename, url),
      tag: `<${variable}/>`,
      debug
    })
  }
  return infos
}

function genAnchorTemplate(children, options = { ignoreGap: false }) {
  return `
  <k-anchor
    iternal-scrollable
    bound="16"
    type="block"
    style="width: 128px; position: stricky; max-height: calc(100vh - 64px); height: auto"
    offset-target="#doc-layout"
    :ignore-gap="${options.ignoreGap}"
  >
  ${children}
  </k-anchor>
  `
}

function genPageAnchorTemplate(tokens) {
  const tiles = tokens
    .filter((token) => token.type === 'heading' && token.depth === 2)
    .map((token) => token.text)
  return
}

function genDemosTemplate(demoInfos, colSpan) {
  return `
  <component-demos :span="${colSpan}">
  ${demoInfos.map(({ tag }) => tag).join('\n')}
  </component-demos>`
}

async function resolveDemoTitle(filename, demoEntryPath) {
  const demoStr = await fsExtra.readFile(
    path.resolve(projectPath, demoEntryPath, '..', filename),
    'utf-8'
  )
  return demoStr.match(/# ([^\n]+)/)[1]
}

function genScript(demoInfos, components = [], url, forceShowAnchor) {
  const showAnchor = !!(demoInfos.length || forceShowAnchor)
  const importStmts = demoInfos
    .map(({ variable, filename }) => `import ${variable} from './${filename}'`)
    .concat(components.map(({ importStmt }) => importStmt))
    .join('\n')
  const componentStmts = demoInfos
    .map(({ variable }) => variable)
    .concat(components.map(({ ids }) => ids).flat())
    .join(',\n')

  return `
<script>
${importStmts}
import {computed,defineComponent } from 'vue'
import { useMemo } from 'vooks'
import { useDisplayMode } from '/demo/store'
import { useIsMobile } from '/demo/utils/composables'

export default defineComponent({
  components: { ${componentStmts} },
  setup(){
    const isMobileRef = useIsMobile()
    const showAnchorRef = useMemo(()=> isMobileRef.value ? false : ${showAnchor})

    return {
      showAnchor: showAnchorRef,
      displayMode: useDisplayMode(),
      wrapperStyle: computed(() =>
        isMobileRef.value
          ? 'padding: 16px 16px 24px 16px'
          : 'display: flex;flex-wrap: nowrap;padding:32px 24px 56px 56px'
        ),
      contentStyle: computed(()=>
        showAnchorRef.value
          ? 'width: calc(100% - 164px); margin-right: 36px;'
          : 'width: 100%; padding-right: 12px'
      ),
      url: ${JSON.stringify(url)}
    }
  }
})
</script>
`
}

export default async function convertMdToDoc(text, url, env = 'development') {
  const forceShowAnchor = !!~text.search('<!--anchor:on-->')
  const colSpan = ~text.search('<!--single-column-->') ? 1 : 2
  const hasApi = !!~text.search('## API')
  const tokens = marked.lexer(text)
  const componentsIndex = tokens.findIndex(
    (token) => token.type === 'code' && token.lang === 'component'
  )
  let components = []
  if (~componentsIndex) {
    components = tokens[componentsIndex].text
    components = components
      .split('\n')
      .map((component) => {
        const [ids, importStmt] = component.split(':')
        if (!ids.trim()) throw new Error('No component id')
        if (!importStmt.trim()) throw new Error('No component source url')
        return {
          ids: ids.split(',').map((id) => id.trim()),
          importStmt: importStmt.trim()
        }
      })
      .filter(({ ids, importStmt }) => ids && importStmt)
    tokens.splice(componentsIndex, 1)
  }

  const titleIndex = tokens.findIndex(
    (token) => token.type === 'heading' && token.depth === 1
  )
  if (~titleIndex) {
    const titleText = JSON.stringify(tokens[titleIndex].text)
    const btnTemplate = `<edit-on-github-header relative-url="${url}" text=${titleText}/>`
    const token = {
      type: 'html',
      pre: false,
      text: btnTemplate
    }
    tokens.splice(titleIndex, 1, token)
  }

  const demosIndex = tokens.findIndex(
    (token) => token.type === 'code' && token.lang === 'demo'
  )
  let demoInfos = []
  if (~demosIndex) {
    demoInfos = await resolveDemoInfos(tokens[demosIndex].text, url, env)
    const token = {
      type: 'html',
      pre: false,
      text: genDemosTemplate(demoInfos, colSpan)
    }
    tokens.splice(demosIndex, 1, token)
  }

  const docMainTemplate = marked.parser(tokens, {
    gfm: true,
    renderer: mdRenderer
  })

  const docTemplate = `
  <template>
    <div class="doc" :style="wrapperStyle">
      <div :style="contentStyle">
      ${docMainTemplate}
      </div>
      <div v-if="showAnchor" style="width: 128px">
        ${demoInfos.length ? '1' : '2'}
      </div>
    </div>
  </template>
  `
  const doScript = await genScript(demoInfos, components, url, forceShowAnchor)
  console.log(demoInfos, components, docTemplate, doScript)
  return `${docTemplate}\n\n${doScript}`
}
