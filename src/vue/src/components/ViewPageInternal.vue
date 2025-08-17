<script setup lang="ts">
const props = defineProps<{
  init: () => Promise<any>
}>();

await props.init();
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
