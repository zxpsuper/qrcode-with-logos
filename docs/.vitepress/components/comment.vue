<template>
  <div>
    <div class="giscus"></div>
  </div>
</template>
<script>
export default {
  name: 'Comment',
  mounted() {
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
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('crossorigin', 'anonymous')
    script.src = 'https://giscus.app/client.js'
    document.body.appendChild(script)
  }
}
</script>
