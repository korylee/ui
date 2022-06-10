import { defineComponent, onMounted, ref, toRef, h, watch } from 'vue'
import { useConfig, useHljs, useTheme } from '../../_hooks'
import { ExtractPublicPropTypes } from '../../_utils'

const codeProps = {
  ...useTheme.props,
  language: String,
  code: {
    type: String,
    default: ''
  },
  trim: {
    type: Boolean,
    default: true
  },
  wordWrap: Boolean,
  uri: Boolean,
  inline: Boolean,
  internalNoHighlight: Boolean
}

export type CodeProps = ExtractPublicPropTypes<typeof codeProps>

export default defineComponent({
  name: 'Code',
  props: codeProps,
  setup(props, { slots }) {
    const { internalNoHighlight } = props
    const { mergedClsPrefixRef } = useConfig(props)
    const codeElRef = ref<HTMLElement | null>(null)
    const hljsRef = (() => {
      if (internalNoHighlight) return undefined
      const res = useHljs(props)
      watch(res, setCode)
      return res
    })()
    function createCodeHtml(language: string, code: string, trim: boolean) {
      const hljs = hljsRef?.value
      if (!hljs) return null
      if (!(language && hljs.getLanguage(language))) return null
      const trimedCode = trim ? code.trim() : code
      return hljs.highlight(trimedCode, { language }).value
    }
    function setCode(): void {
      if (slots.default) return
      const codeEl = codeElRef.value
      if (!codeEl) return
      const { language } = props
      const code = props.uri
        ? window.decodeURIComponent(props.code)
        : props.code
      if (language) {
        const html = createCodeHtml(language, code, props.trim)
        if (html !== null) {
          codeEl.innerHTML = props.inline ? html : `<pre>${html}</pre>`
          return
        }
      }
      if (props.inline) {
        codeEl.textContent = code
        return
      }
      const maybePreEl = codeEl.children[0]
      if (maybePreEl?.tagName === 'PRE') maybePreEl.textContent = code
      else {
        const warp = document.createElement('pre')
        warp.textContent = code
        codeEl.innerHTML = ''
        codeEl.appendChild(warp)
      }
    }
    onMounted(setCode)
    watch([toRef(props, 'language'), toRef(props, 'code')], setCode)

    return {
      codeElRef,
      mergedClsPrefix: mergedClsPrefixRef
    }
  },
  render() {
    return (
      <code
        ref="codeElRef"
        class={[
          `${this.mergedClsPrefix}-code`,
          this.wordWrap && `${this.mergedClsPrefix}-code--word-wrap`
        ]}
      >
        {this.$slots}
      </code>
    )
  }
})
