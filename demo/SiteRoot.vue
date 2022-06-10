<template>
  <k-config-provider
    class="demo"
    namespace="ui-doc"
    preflight-style-disabled
    :hljs="hljs"
  >
    <Site />
  </k-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import Site from './Site.vue'
import { siteSetup } from './store/index'

export default defineComponent({
  name: 'SiteRoot',
  components: { Site },
  setup() {
    return siteSetup()
  }
})
</script>
