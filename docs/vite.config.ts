import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ mode }) => {
  const plugins = [
    Components({
      allowOverrides: true,
      resolvers: [IconsResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    UnoCSS(),
    Icons({
      autoInstall: true,
    }),
    MarkdownTransform(),
  ]
  console.log(mode === 'development')
  if (mode === 'development') {
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
