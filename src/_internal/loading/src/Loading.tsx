import { defineComponent, toRef } from 'vue'
import { useStyle } from '../../../_hooks'
import style from './styles/index.cssr'

export default defineComponent({
  name: 'BaseLoading',
  props: {
    clsPrefix: { type: String, required: true },
    scale: { type: Number, default: 1 },
    radius: { type: Number, default: 100 },
    strokeWidth: { type: Number, default: 28 },
    strock: { type: String, default: undefined },
    show: { type: Boolean, default: true }
  },
  setup(props) {
    useStyle('base-loading', style, toRef(props, 'clsPrefix'))
  },
  render() {
    const { clsPrefix, radius, scale } = this
    const scaledRadius = radius / scale
    return (
      <div class={`${clsPrefix}-base-loading`} role="img" aria-label="loading">
        {this.show ? (
          <div
            key="icon"
            class={`${clsPrefix}-base-loading__transition-wrapper`}
          >
            <div class={`${clsPrefix}-base-loading__container`}>
              <div class={`${clsPrefix}-base-loading__container-layer`}>
                <div
                  class={`${clsPrefix}-base-loading-container-layer-left`}
                ></div>
                <div
                  class={`${clsPrefix}-base-loading-container-layer-patch`}
                ></div>
                <div
                  class={`${clsPrefix}-base-loading-container-layer-right`}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            key="placeholder"
            class={`${clsPrefix}-base-loading__placeholder`}
          >
            {this.$slots}
          </div>
        )}
      </div>
    )
  }
})
