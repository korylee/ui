<template>
  <k-layout-header bordered class="nav">
    <k-text tag="div" class="ui-logo">
      <span v-if="!isMobile">Naive ui</span>
    </k-text>
    <div :style="!isMobile ? 'display: flex; align-items: center;' : ''"></div>
  </k-layout-header>
</template>
<script>
import { defineComponent } from 'vue'
import { useIsMobile } from './utils/composables'

export default defineComponent({
  name: 'SiteHeader',
  components: {},
  setup() {
    const isMobileRef = useIsMobile()
    return {
      isMobile: isMobileRef
    }
  }
})
</script>
