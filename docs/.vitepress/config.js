export default {
  // 站点级选项
  title: 'qrcode-with-logos',
  description: 'The tool for creating a QRcode with logo',
  base: '/qrcode-with-logos/',
  lastUpdated: true,
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    // 主题级选项
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com/zxpsuper/qrcode-with-logos' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Options', link: '/guide/options' },
          { text: 'Methods', link: '/guide/methods' },
          { text: 'Discussions', link: '/guide/discussions' },
        ]
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present zxpsuper'
    }
  }
}