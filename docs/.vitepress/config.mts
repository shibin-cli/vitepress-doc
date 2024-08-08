import { defineConfig } from 'vitepress'
import mdPlugin from './plugins/markdownPlugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress 搭建文档',
  description: 'Vitepress 搭建组件文档',
  base: '/vitepress-doc/',
  markdown: {
    config: (md) => mdPlugin(md),
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '开始', link: '/start' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: '开始', link: '/start' },
          { text: '查看效果', link: '/examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shibin-cli/vitepress-doc' },
    ],
  },
})
