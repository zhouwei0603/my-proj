<script setup lang="ts">
defineProps<{
  date?: Date | string;
}>();
</script>

<template>
  {{ date ? new Date(date).toLocaleString() : "-" }}
</template>
