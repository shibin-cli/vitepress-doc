---
outline: deep
---

## Basic usage
:::demo
```vue
<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
</script>
<template>
  <editor v-model="val" style="height: 280px" placeholder="Please input"/>
</template>
```
:::


## Attributes

| Name    | Description   | Type    | Default  |
| ------- | ------ | ------- | ------- |
|model-value / v-model |	value | string | — |
| placeholder    | placeholder   | string  | — |
## Events
| Name    | Description   | Parameters    | 
| ------- | ------ | ------- | 
| change    | Trigger when selected value is changed  | val，目前的选中值 |