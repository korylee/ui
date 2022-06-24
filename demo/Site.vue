<template>
  <k-layout class="root-layout" :position="isMobile ? 'static' : 'absolute'">
    <SiteHeader />
    <router-view />
  </k-layout>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useIsMobile } from './utils/composables'
import SiteHeader from './SiteHeader.vue'

export default defineComponent({
  name: 'Site',
  components: { SiteHeader },
  setup() {
    const isMobileRef = useIsMobile()
    onMounted(() => {})
    return {
      isMobile: isMobileRef
    }
  }
})
</script>
