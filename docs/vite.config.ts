import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig(({ command }) => {
  const plugins = [
    MarkdownTransform(),
    UnoCSS(),
    Icons({
      autoInstall: true,
    }),
  ]
  if (command === 'serve') {
    plugins.push(
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        hoistStatic: {
          exclude: ['./**/*.vue'],
        },
        plugins: {
          vueJsx: vueJsx(),
        },
      }),
    )
  }
  return {
    plugins,
  }
})
