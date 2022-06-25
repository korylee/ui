import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'ComponentDemos',
  props: { span: { type: Number, default: 2 } },
  setup() {
    return {}
  },
  render() {
    const children = this.$slots.default?.() ?? []
    return (
      <div
        style={{
          display: 'grid',
          gap: '16px'
        }}
      >
        {children}
      </div>
    )
  }
})
