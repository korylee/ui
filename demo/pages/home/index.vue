<template>
  <k-layout id="doc-layout">
    <k-layout>
      <router-view />
    </k-layout>
  </k-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home'
})
</script>
