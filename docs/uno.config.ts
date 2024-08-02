import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";
console.log("unocss");
export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  include: [`./**/*`],
  exclude: [`./node_modules/**/*`, `./.vitepress/cache/**/*`],
  rules: [["m-1", { margin: "1px" }]],
});
