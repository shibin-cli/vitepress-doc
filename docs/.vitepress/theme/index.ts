import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Demo from '../components/Demo.vue'
import ElementPlus from 'element-plus'
import './style.scss'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {})
  },
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
    app.component('Demo', Demo)
  },
} satisfies Theme
