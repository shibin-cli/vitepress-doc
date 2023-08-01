import { defineConfig } from "vitepress";
import {
  demoblockPlugin,
  demoblockVitePlugin,
} from "vitepress-theme-demoblock";
import path from "path";
import tableWrapper from './plugins/tableWrapper'
import { ApiTableContainer } from './plugins/apiTable'

export default defineConfig({
  title: "组件",
  description: "组件库文档",
  base: "/doc",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "组件", link: "/components/start.md", activeMatch: "^/components/" },
    ],

    sidebar: [
      {
        text: "Components",
        items: [
          { text: "Start", link: "/components/start" },
          { text: "SelectMultiple", link: "/components/select-multiple" },
          { text: "Editor", link: "/components/editor" },
        ],
      },
    ],
    // @ts-ignore
    demoblock: {
      root: {
        "view-source": "View source",
        "hide-source": "Hide source",
        "copy-code": "Copy code",
        "copy-success": "Copy success",
        "copy-error": "Copy error",
      },
      zh: {
        "view-source": "查看源代码",
        "hide-source": "隐藏源代码",
        "copy-code": "复制代码",
        "copy-success": "复制成功",
        "copy-error": "复制失败",
      },
    },
  },
  markdown: {
    theme: { light: "solarized-light", dark: "solarized-dark" },
    config: (md) => {
      md.use(demoblockPlugin);
      md.use(tableWrapper)
      md.use(ApiTableContainer)
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../components"),
      },
    },
    plugins: [demoblockVitePlugin()],
  },
});