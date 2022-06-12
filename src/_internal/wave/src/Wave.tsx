import { defineComponent, h, nextTick, onBeforeUnmount, ref, toRef } from 'vue'
import { useStyle } from '../../../_hooks'
import style from './styles/index.cssr'

export interface BaseWaveRef {
  play: () => void
}

export default defineComponent({
  name: 'BaseWave',
  props: {
    clsPrefix: { type: String, required: true }
  },
  setup(props) {
    useStyle('base-wave', style, toRef(props, 'clsPrefix'))
    const selfElRef = ref<HTMLElement | null>(null)
    const activeRef = ref(false)

    let animationTimerId: number | null = null
    onBeforeUnmount(clearAnimationTimer)
    function clearAnimationTimer() {
      if (animationTimerId === null) return
      window.clearTimeout(animationTimerId)
      animationTimerId = null
      activeRef.value = false
    }
    return {
      selfElRef,
      active: activeRef,
      play() {
        clearAnimationTimer()
        void nextTick(() => {
          void selfElRef.value?.offsetHeight
          activeRef.value = true
          animationTimerId = window.setTimeout(() => {
            activeRef.value = false
            animationTimerId = null
          }, 1000)
        })
      }
    }
  },
  render() {
    const { clsPrefix } = this
    return (
      <div
        ref="selfElRef"
        aria-hidden
        class={[
          `${clsPrefix}-base-wave`,
          this.active && `${clsPrefix}-base-wave--active`
        ]}
      />
    )
  }
})
