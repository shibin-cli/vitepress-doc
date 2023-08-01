// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import SelectMultiple from '../../../components/SelectMultiple.vue'
import Editor from '../../../components/Editor.vue'
import ClientOnly from '../../../components/ClientOnly.vue'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.scss'
export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
    })
  },
  enhanceApp({ app, router, siteData }) {
    Theme.enhanceApp( {app, router, siteData })
    app.component('Demo', Demo)
    app.component('SelectMultiple', SelectMultiple)
    app.component('Editor', Editor)
    app.component('ClientOnly', ClientOnly)
    app.use(ElementPlus)
  }
}
