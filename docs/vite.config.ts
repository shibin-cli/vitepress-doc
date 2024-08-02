import { MarkdownTransform } from "./.vitepress/plugins/markdownTransform";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import VueMacros from "unplugin-vue-macros/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
export default defineConfig(() => {
  return {
    plugins: [
      MarkdownTransform(),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        hoistStatic: {
          exclude: ["./**/*.vue"],
        },
        plugins: {
          vueJsx: vueJsx(),
        },
      }),

      Components({
        dirs: ["docs/.vitepress/vitepress/components"],

        allowOverrides: true,

        // custom resolvers
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
      UnoCSS(),
      Icons({
        // experimental
        autoInstall: true,
      }),
    ],
  };
});
