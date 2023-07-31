---
outline: deep
---

## Basic usage
:::demo
```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>([])
const filterValue = ref<string[]>([])
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>
<template>
  <select-multiple :optionArr="options" v-model="value" ref="filterValue"/>
</template>
```
:::

## Attributes

| Name    | Description   | Type    | Default  |
| ------- | ------ | ------- | ------- |
| optionArr    | An array of options inside the Multiple Select Dropdown   | array  | [] |
| placeholder    | placeholder   | string  | — |
| useValue | Boolean value to indicate whether to use the `value` or `label` for selected options | boolean | true |
## Events
| Name    | Description   | Parameters    | 
| ------- | ------ | ------- | 
| change    | Trigger when selected value is changed  | val，目前的选中值 |

## Methods
| Name    | Description   | Parameters |
| ------- | ------ | ------- | 
| focus    | Used to manual trigger focus to the dropdown using ref   | — |
