import { marked } from 'marked'
import createRenderer from './md-renderer'
import fs from 'fs'
import path from 'path'
import handleMergeCode from '../utils/handle-merge-code'

const mdRenderer = createRenderer()
const __HTTP__ = process.env.NODE_ENV !== 'production' ? 'http' : 'https'
const demoBlock = fs
  .readFileSync(path.resolve(__dirname, 'ComponentDemoTemplate.vue'))
  .toString()

function genVueComponent(parts, filename, relativeUrl) {
  const demoFilenameReg = /<!--DEMO_FILE_NAME-->/g
  const relativeUrlReg = /<!--URL-->/g
  const titleReg = /<!--TITLE_SLOT-->/g
  const contentReg = /<!--CONTENT_SLOT-->/
  const tsCodeReg = /<!--TS_CODE_SLOT-->/
  const jsCodeReg = /<!--JS_CODE_SLOT-->/
  const scriptReg = /<!--SCRIPT_SLOT-->/
  const styleReg = /<!--STYLE_SLOT-->/
  const demoReg = /<!--DEMO_SLOT-->/
  const languageTypeReg = /<!--LANGUAGE_TYPE_SLOT-->/
  let src = demoBlock
  src = src.replace(demoFilenameReg, filename)
  src = src.replace(relativeUrlReg, relativeUrl)
  if (parts.content) src = src.replace(contentReg, parts.content)
  if (parts.title) src = src.replace(titleReg, parts.title)
  if (parts.tsCode) src = src.replace(tsCodeReg, parts.tsCode)
  if (parts.jsCode) src = src.replace(jsCodeReg, parts.jsCode)
  if (parts.script) {
    const startScriptTag =
      parts.language === 'ts' ? `<script lang="ts">\n` : `<script>\n`
    src = src.replace(scriptReg, startScriptTag + parts.script + `\n</script>`)
  }
  if (parts.language) src = src.replace(languageTypeReg, parts.language)
  if (parts.style) {
    const style = genStyle(parts.style)
    if (style !== null) {
      src = src.replace(styleReg, style)
    }
  }
  if (parts.template) src = src.replace(demoReg, parts.template)
  if (/__HTTP__/.test(src)) src = src.replace(/__HTTP__/g, __HTTP__)
  return src.trim()
}

function getPartsOfDemo(tokens) {
  let template = null
  let script = null
  let style = null
  let title = null
  let languageType = 'js'
  const contentTokens = []
  contentTokens.links = tokens.links
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.title
    } else if (
      token.type === 'code' &&
      ['template', 'html'].includes(token.lang)
    ) {
      template = token.text
    } else if (
      token.type === 'code' &&
      ['script', 'js', 'ts'].includes(token.lang)
    ) {
      languageType = token.lang
      script = token.text
    } else if (token.type === 'code' && ['style', 'css'].includes(token.lang)) {
      style = token.text
    } else {
      contentTokens.push(token)
    }
  }
  return {
    title,
    template,
    script,
    style,
    language: languageType,
    content: marked.parser(contentTokens, { renderer: mdRenderer })
  }
}

function mergeParts({ parts, isVue }) {
  const mergedParts = {
    ...parts,
    title: parts.title,
    content: parts.content,
    tsCode: '',
    jsCode: ''
  }
  handleMergeCode({ parts, mergedParts, isVue })
  mergedParts.tsCode = encodeURIComponent(mergedParts.tsCode)
  mergedParts.jsCode = encodeURIComponent(mergedParts.jsCode)
  return mergedParts
}

const cssRuleRegex = /([^{}]*)(\{[^}]*\})/g

function genStyle(sourceStyle) {
  let match
  let matched = false
  const rules = []
  while ((match = cssRuleRegex.exec(sourceStyle)) !== null) {
    matched = true
    const selector = match[1]
    const body = match[2]
    const rule =
      selector
        .split(',')
        .map((part) => `.demo-card__view ${part}, .naive-ui-doc ${part}`)
        .join(',') + body
    rules.push(rule)
  }
  if (!matched) return null
  return `<style scoped>${rules.join('\n')}</style>`
}

function getFileName(resourcePath) {
  const dirs = resourcePath.split('/')
  const fileNameWithExtension = dirs[dirs.length - 1]
  return [fileNameWithExtension.split('.')[0], fileNameWithExtension]
}

function convertMd2Demo(text, { resourcePath, isVue = false, relativeUrl }) {
  const tokens = marked.lexer(text)
  const parts = getPartsOfDemo(tokens)
  const mergedParts = mergeParts({ parts, isVue })
  const [filename] = getFileName(resourcePath)
  return genVueComponent(mergedParts, filename, relativeUrl)
}

export { convertMd2Demo, getFileName, mergeParts, genVueComponent }
export default convertMd2Demo
