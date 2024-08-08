---
outline: deep
---

# 开始

## 实现效果

展示 `start/button.vue` 的代码和显示效果

```md
:::demo Use `type`, `plain`, `round` and `circle` to define Button's style.

start/button
:::
```

下面是展示效果
:::demo Use `type`, `plain`, `round` and `circle` to define Button's style.

start/button
:::

在 [vitepress](https://vitepress.dev) 创建的项目中，如何不做任何配置，不支持类似上面方式展示代码

[element-plus](https://element-plus.org) 使用 [markdown-it-container](https://github.com/markdown-it/markdown-it-container) 创建了一个自定义容器，使用方式类似于：

```md
::: demo

demo/demo
:::
```

## 创建 vitepress 项目

首先创建 vitepress 项目，可以参考 https://vitepress.dev/guide/getting-started

```bash
npx vitepress init
```

## 编写 Markdown Plugin

### 安装依赖

安装 `markdown-it` 和 `markdown-it-container`

```bash
npm i markdown-it markdown-it-container
```

### 编写代码

首先要让 markdown 能够正确识别 `::: demo`

```ts
// .vitepress/config.mts
export default defineConfig({
  markdown: {
    config: (md) => mdPlugin(md),
  },
})
```

```ts
// mdPlugin.ts
import fs from 'fs'
import path from 'path'
import type MarkdownIt from 'markdown-it'
import mdContainer from 'markdown-it-container'
import type Renderer from 'markdown-it/lib/renderer'
import type Token from 'markdown-it/lib/token'
interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer,
  ): string
}

export default function mdPlugin(md: MarkdownIt) {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve('./docs', 'examples', `${sourceFile}.vue`),
            'utf-8',
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<demo :demos="demos" source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``),
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source,
        )}" description="${encodeURIComponent(md.render(description))}">`
      } else {
        return '</demo>'
      }
    },
  } as ContainerOpts)
}
```

这里的 sourceFile 就是 `:::demo` 里的内容， source 就是 `docs/examples/{sourceFile}.vue` 文件内容

接下来就要实现 `Demo` 组件

## 实现组件预览组件

### Demo 组件

这里可以根据自己的需求和喜好进行实现，我这里使用了 `element-plus` 的样式，所以需要先导入 `element-plus`

```ts
// .vitepress/theme/index.ts
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Demo from '../components/Demo.vue'
import ElementPlus from 'element-plus'
import './style.css'
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
```

接下来实现 `Demo` 组件，下面样式是我参考了 `element-plus` 的样式实现的

```vue
<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'
import Example from './Example.vue'
import SourceCode from './SourceCode.vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { CaretTop } from '@element-plus/icons-vue'
const props = defineProps<{
  demos: object
  source: string
  path: string
  rawSource: string
  description?: string
}>()
const [sourceVisible, toggleSourceVisible] = useToggle()

const decoded = computed(() => {
  return decodeURIComponent(props.source)
})
const formatPathDemos = computed(() => {
  const demos = {}
  Object.keys(props.demos).forEach((key) => {
    demos[key.replace('./examples/', '').replace('.vue', '')] =
      props.demos[key].default
  })
  return demos
})
const decodedDescription = computed(() =>
  decodeURIComponent(props.description!),
)

const vm = getCurrentInstance()!
const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})
const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties
  if (!isSupported) {
    $message.error('复制出错')
  }
  try {
    await copy()
    $message.success('复制成功')
  } catch (e: any) {
    $message.error(e.message)
  }
}
const sourceCodeRef = ref<HTMLButtonElement>()

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}
</script>

<template>
  <div>
    <p text="sm" v-html="decodedDescription" />

    <div class="example">
      <Example :demo="formatPathDemos[path]" />
      <ElDivider class="m-0" />
      <div class="op-btns">
        <ElTooltip
          content="复制代码"
          :show-arrow="false"
          :trigger="['hover', 'focus']"
          :trigger-keys="[]"
        >
          <ElIcon
            :size="16"
            aria-label="复制代码"
            class="op-btn"
            tabindex="0"
            role="button"
            @click="copyCode"
            @keydown.prevent.enter="copyCode"
            @keydown.prevent.space="copyCode"
          >
            <i-ri-file-copy-line />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          content="查看源代码"
          :show-arrow="false"
          :trigger="['hover', 'focus']"
          :trigger-keys="[]"
        >
          <button
            ref="sourceCodeRef"
            :aria-label="sourceVisible ? '隐藏源代码' : '查看源代码'"
            class="reset-btn el-icon op-btn"
            @click="toggleSourceVisible()"
          >
            <ElIcon :size="16">
              <i-ri-code-line />
            </ElIcon>
          </button>
        </ElTooltip>
      </div>
      <ElCollapseTransition>
        <source-code v-show="sourceVisible" :source="source" />
      </ElCollapseTransition>
      <Transition name="el-fade-in-linear">
        <div
          v-show="sourceVisible"
          class="example-float-control"
          tabindex="0"
          role="button"
          @click="toggleSourceVisible(false)"
          @keydown="onSourceVisibleKeydown"
        >
          <ElIcon :size="16">
            <CaretTop />
          </ElIcon>
          <span>隐藏源代码</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.language-vue) {
  margin: 0 !important;
  border-radius: 0 !important;
}
.example {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
.op-btns {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2.5rem;
  .el-icon {
    &:hover {
      color: var(--primary);
    }
  }
  .op-btn {
    margin: 0 0.5rem;
    cursor: pointer;
    transition: 0.2s;
  }
}
.example-float-control {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--el-border-color);
  height: 44px;
  box-sizing: border-box;
  background-color: var(--el-bg-color);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-top: -1px;
  cursor: pointer;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  span {
    font-size: 14px;
    margin-left: 10px;
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
```

demos 此时是 undefined，需要在 `vite.config.ts` 中进行处理

```ts
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig(() => {
  return {
    plugins: [MarkdownTransform()],
  }
})
```

```ts
// ./.vitepress/plugins/markdownTransform.ts
import type { Plugin } from 'vite'
import path from 'path'
type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

export function MarkdownTransform(): Plugin {
  return {
    name: 'element-plus-md-transform',

    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return

      const componentId = path.basename(id, '.md')
      if (componentId === 'index') return code
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.glob('./examples/${componentId}/*.vue', { eager: true })`,
        ],
      }

      code = transformVpScriptSetup(code, append)
      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      )
    },
  }
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
  ${codes.join('\n')}
  </script>
  `
const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[],
) => {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  code += footers.join('\n')

  return `${code}\n`
}
const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE)
  if (matches) code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup) append.scriptSetups.push(scriptSetup)
  return code
}
```

### 展示源代码

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
})

const decoded = computed(() => {
  return decodeURIComponent(props.source)
})
</script>

<template>
  <div class="example-source-wrapper">
    <div class="example-source" v-html="decoded" />
  </div>
</template>

<style scoped lang="scss">
:deep(.language-vue) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
```

### 展示组件

```vue
<script setup lang="ts">
defineProps<{
  demo: object
}>()
</script>

<template>
  <div class="example-showcase">
    <component :is="demo" v-if="demo" v-bind="$attrs" />
  </div>
</template>

<style lang="scss" scoped>
.example-showcase {
  padding: 1.5rem;
  margin: 0.5px;
  background-color: var(--bg-color);
}
</style>
```

### 组件刷新

在这里我们发现，我们写的代码示例代码改变时，没办法实时刷新，通过在 `vite.config.ts` 中使用 `unplugin-vue-macros` 来实现组件实时刷新

```ts
// vite.config.ts
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig(() => {
  return {
    plugins: [
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
    ],
  }
})
```
