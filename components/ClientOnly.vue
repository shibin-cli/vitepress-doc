
<script setup>
    const isClient = import.meta.env.SSR === false;
</script>
<template>
  <div v-if="isClient">
    <slot></slot>
  </div>
</template>