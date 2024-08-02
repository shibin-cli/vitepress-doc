<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import Example from "./Example.vue";
import SourceCode from "./SourceCode.vue";
import { useClipboard, useToggle } from "@vueuse/core";
import { CaretTop } from "@element-plus/icons-vue";
const props = defineProps<{
  demos: object;
  source: string;
  path: string;
  rawSource: string;
  description?: string;
}>();
const [sourceVisible, toggleSourceVisible] = useToggle();

const decoded = computed(() => {
  return decodeURIComponent(props.source);
});
const formatPathDemos = computed(() => {
  const demos = {};
  Object.keys(props.demos).forEach((key) => {
    demos[key.replace("./examples/", "").replace(".vue", "")] =
      props.demos[key].default;
  });
  return demos;
});
const decodedDescription = computed(() =>
  decodeURIComponent(props.description!)
);

const vm = getCurrentInstance()!;
const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
});
const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties;
  if (!isSupported) {
    $message.error("复制出错");
  }
  try {
    await copy();
    $message.success("复制成功");
  } catch (e: any) {
    $message.error(e.message);
  }
};
const sourceCodeRef = ref<HTMLButtonElement>();

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (["Enter", "Space"].includes(e.code)) {
    e.preventDefault();
    toggleSourceVisible(false);
    sourceCodeRef.value?.focus();
  }
};
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
// p {
//   font-size: 14px;
// }
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
  //   color: var(--el-text-color-secondary);
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
