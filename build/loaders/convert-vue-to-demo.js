import { marked } from 'marked'
import { genVueComponent, getFileName, mergeParts } from './convert-md-to-demo'
import createRenderer from './md-renderer'

const mdRenderer = createRenderer()

function getPartsOfDemo(text) {
  const firstIndex = text.indexOf('<template>')
  let template = text.slice(firstIndex + 10)
  const lastIndex = template.lastIndexOf('</template>')
  template = template.slice(0, lastIndex)
  const script = text.match(/<script.*?>([\s\S]*?)<\/script>/)?.[1]?.trim()
  const style = text.match(/<style>([\s\S]*?)<\/style>/)?.[1]
  const markdownText = text
    .match(/<markdown>([\s\S]*?)<\/markdown>/)?.[1]
    ?.trim()
  const tokens = marked.lexer(markdownText)
  const contentTokens = []
  let title = ''
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.text
    } else {
      contentTokens.push(token)
    }
  }
  const languageType = text.includes('lang="ts"') ? 'ts' : 'js'
  const content = marked.parser(contentTokens, { renderer: mdRenderer })
  return {
    template,
    script,
    style,
    title,
    content,
    language: languageType
  }
}

function concertVue2Demo(content, { resourcePath, relativeUrl, isVue = true }) {
  const parts = getPartsOfDemo(content)
  const mergedParts = mergeParts({ parts, isVue })
  const [filename] = getFileName(resourcePath)
  return genVueComponent(mergedParts, filename + '.vue', relativeUrl)
}

export default concertVue2Demo
