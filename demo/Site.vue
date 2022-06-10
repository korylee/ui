<template>
  <k-layout class="root-layout" :position="isMobile ? 'static' : 'absolute'">
    <router-view />
  </k-layout>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useIsMobile } from './utils/composables'

export default defineComponent({
  name: 'Site',
  components: {},
  setup() {
    const isMobileRef = useIsMobile()
    onMounted(() => {})
    return {
      isMobile: isMobileRef
    }
  }
})
</script>
