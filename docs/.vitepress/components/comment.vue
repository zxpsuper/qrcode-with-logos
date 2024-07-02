<template>
  <div>
    <div class="giscus" ref="giscus"></div>
  </div>
</template>
<script>
import { useData } from 'vitepress'
import { ref, onMounted, watch  } from 'vue'

export default {
  name: 'Comment',
  setup() {
    const giscus = ref()
    const { isDark } = useData()
    const loadJs = () => {
      giscus.value.innerHTML = ''
      const script = document.createElement('script')
      script.setAttribute('data-repo', 'zxpsuper/qrcode-with-logos')
      script.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkxOTM4MjUxODg=')
      script.setAttribute('data-category', 'Announcements')
      script.setAttribute('data-category-id', 'DIC_kwDOC42JpM4CgVKz')
      script.setAttribute('data-mapping', 'pathname')
      script.setAttribute('data-strict', '0')
      script.setAttribute('data-reactions-enabled', '1')
      script.setAttribute('data-emit-metadata', '0')
      script.setAttribute('data-input-position', 'bottom')
      // light  light_protanopia light_tritanopia noborder_light
      // dark dark_high_contrast dark_protanopia dark_tritanopia dark_dimmed noborder_dark
      script.setAttribute('data-theme', isDark.value ? 'dark_protanopia' : 'light_protanopia')
      script.setAttribute('data-lang', 'en')
      script.setAttribute('crossorigin', 'anonymous')
      script.src = 'https://giscus.app/client.js'
      document.body.appendChild(script)
    }

    watch(isDark, () => {
      loadJs()
    })
    onMounted(() => {
      loadJs()
    })
    return {
      giscus
    }
  }
}
</script>
