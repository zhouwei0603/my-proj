<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { ref, watch } from "vue";

const props = defineProps<{
  loader: Promise<string>;
}>();

const loading = ref<boolean>(false);
const content = ref<string>();

watch(
  () => props.loader,
  async () => {
    try {
      loading.value = true;
      content.value = await props.loader;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="!loading && content">{{ content }}</div>
  <div v-if="!loading && !content">
    <slot name="default"></slot>
  </div>
  <el-icon v-if="loading" class="is-loading">
    <Loading />
  </el-icon>
</template>
