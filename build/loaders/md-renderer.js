import hljs from 'highlight.js'
import { marked } from 'marked'

export default function createRenderer(wrapCodeWithCard = true) {
  const renderer = new marked.Renderer()
  const overrides = {
    table(header, body) {
      if (body) body = `<tbody>${body}</tbody>`
      return `
      <div class="md-table-wrapper">
        <k-table single-column class="md-table">
          <thead>${header}</thead>
          ${body}
        </k-table>
      </div>`
    },
    tablerow(content) {
      return `<tr>${content}</tr>`
    },
    tablecell(content, flags) {
      const type = flags.header ? 'th' : 'td'
      const tag = flags.align ? `<type align="${flags.align}">` : `<${type}>`
      return `${tag}${content}</${type}>`
    },

    code(code, language) {
      if (language.startsWith('__')) language = language.replace('__', '')
      const isLanguageValid = !!(language && hljs.getLanguage(language))
      if (!isLanguageValid)
        throw new Error(
          `MdRenderer: ${language} is note valid for code -${code}`
        )
      const highlighted = hljs.highlight(code, { language }).value
      const content = `<k-code><pre v-pre>${highlighted}</pre></k-code>`
      return wrapCodeWithCard
        ? `<k-card size="small" class="md-card" content-style="padding: 0;">
            <k-scrollbar x-scrollable content-style="padding: 12px 16px;">
              ${content}
            </k-scrollbar>
          </k-card>`
        : content
    },
    heading(text, level) {
      const id = text.replace(/ /g, '-')
      return `<k-h${level} id="${id}">${text}</k-h${level}>`
    },
    blockquote: (quote) => `<k-blockquote>${quote}</k-blockquote>`,
    hr: () => '<k-hr />',
    paragraph: (text) => `<k-p>${text}</k-p>`,
    link: (href, text) => {
      if (/^(http:|https:)/.test(href)) {
        return `<k-a href="${href}">${text}</k-a>`
      }
      return `<router-link to="${href}" #="{ navigate, href }" custom><k-a :href="href" @click="navigate">${text}</k-a></router-link>`
    },
    list(body, ordered, start) {
      const type = ordered ? 'k-ol' : 'k-ul'
      const startatt = ordered && start !== 1 ? `start="${start}"` : ''
      return `<${type} ${startatt}>${body}</${type}>\n`
    },
    listitem: (text) => `<k-li>${text}</k-li>`,
    codespan: (code) => `<k-text code>${code}</k-text>`,
    strong: (text) => `<k-text strong>${text}</k-text>`,
    checkbox(checked) {
      return `<k-checkbox :checked="${checked}" style="vertical-align: -2px; margin-right: 8px;" />`
    }
  }

  Object.keys(overrides).forEach((key) => {
    renderer[key] = overrides[key]
  })
  return renderer
}
