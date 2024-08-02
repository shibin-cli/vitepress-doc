import { defineConfig } from 'vitepress'
import mdPlugin from './plugins/markdownPlugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Element Plus Starter',
  description: 'A VitePress Site',
  base: '/vitepress-doc/',
  markdown: {
    config: (md) => mdPlugin(md),
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/shibin-cli/vitepress-doc' }]
  }
})
