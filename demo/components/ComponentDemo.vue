<template>
  <k-card
    v-if="showDemo"
    :id="demoFilename"
    class="demo-card"
    :segmented="{ footer: true }"
  >
    <template #header>
      <span style="cursor: pointer" @click="handleTitleClick">
        <slot name="title" /></span
    ></template>
    <template #header-extra>
      <k-tootip ref="expandCodeButtonRef">
        <template #trigger>
          <k-button
            style="padding: 0"
            size="tiny"
            text
            depth="3"
            @click="toggleCodeDisplay"
            ><template #icon>
              <k-icon> <code-outline /> </k-icon> </template></k-button
        ></template>
        {{ !showCode ? t('show') : t('hide') }}
      </k-tootip>
    </template>
    <slot name="content" />
    <slot name="demo" />
    <template v-if="showCode" #footer>
      <k-tabs
        v-if="languageType === 'ts'"
        size="small"
        type="segment"
        style="padding: 12px 24px 0 24px"
        :value="showTs ? 'ts' : 'js'"
        @update:value="($e) => (showTs = $e === 'ts')"
      >
        <k-tab name="ts"> TypeScript </k-tab>
        <k-tab name="js"> JavaScript </k-tab>
      </k-tabs>
      <k-scrollbar
        x-scrollable
        content-style="padding: 20px 24px;"
        style="height: auto"
      >
        <k-code v-if="showTs" language="html" :code="sfsJsCode" />
        <k-code v-else language="html" :code="sfsJsCode" />
      </k-scrollbar>
    </template>
  </k-card>
</template>

<script>
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { CodeOutline } from '@vicons/ionicons5'
import { useDisplayMode } from '../store'
import { i18n } from '../utils/composables'

export default defineComponent({
  name: 'ComponentDemo',
  components: { CodeOutline },
  props: {
    title: { type: String, requied: true },
    tsCode: { type: String, requied: true },
    jsCode: { type: String, requied: true },
    demoFilename: { type: String, requied: true },
    relativeUrl: { type: String, requied: true },
    languageType: { type: String, default: 'js' }
  },
  setup(props) {
    const displayModeRef = useDisplayMode()
    const showDemoRef = computed(() => {
      const isDebugDemo = /(d|D)ebug/.test(props.demoFilename ?? '')
      return !(isDebugDemo && displayModeRef.value !== 'debug')
    })
    const showCodeRef = ref(true)
    const showTsRef = ref(props.languageType === 'ts')
    const expandCodeButtonRef = ref(null)
    watch(showCodeRef, () =>
      nextTick(() => {
        expandCodeButtonRef.value?.syncPosition()
      })
    )
    return {
      showDemo: showDemoRef,
      expandCodeButtonRef,
      showCode: showCodeRef,
      showTs: showTsRef,
      sfsTsCode: decodeURIComponent(props.tsCode ?? ''),
      sfsJsCode: decodeURIComponent(props.jsCode ?? ''),
      toggleCodeDisplay() {
        showCodeRef.value = !showCodeRef.value
      },
      handleTitle() {
        window.location.hash = `#${props.demoFilename}`
      },
      toggleLanguageChange() {
        showTsRef.value = !showTsRef.value
      },
      ...i18n({
        'zh-CN': {
          show: '显示代码',
          hide: '收起代码'
        },
        'en-US': {
          show: 'Show Code'
        }
      })
    }
  }
})
</script>
