// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import Comment from '../components/comment.vue'

import Tongji from '../components/tongji.vue'
import 'element-plus/dist/index.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.use(ElementPlus)
    app.component('Comment', Comment)
    app.component('Tongji', Tongji)
  }
}