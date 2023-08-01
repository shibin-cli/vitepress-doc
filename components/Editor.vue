<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  modelValue?: string,
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'change', value: string): void
}>()

const editor = ref()
const toolbarOptions = [
  { header: [1, 2, 3, 4, 5, 6, false] },{ font: [] },'bold','italic','underline',{ align: [] },'link','image','code-block',
]

onMounted(async () => {
  const { default: Quill } = await import('quill')
  // @ts-ignore
  import('quill/dist/quill.snow.css')
  editor.value = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow',
    placeholder: props.placeholder
  })
  editor.value.on('text-change', () => {
    emit('update:modelValue', editor.value.root.innerHTML)
    emit('change', editor.value.root.innerHTML)
  })
})
</script>
<template>
  <div id="editor"></div>
</template>

