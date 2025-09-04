<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import { ElAvatar } from 'element-plus';
import { ref, watch } from 'vue';

const props = defineProps<{
  name?: string,
  showName?: boolean
}>();

const url = ref<string>();

const load = async () => {
  if (props.name) {
    // TODO: fetch real profile picture URL by user name
    if (props.name.toLowerCase().includes("python")) {
      url.value = `https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg`
    } else {
      url.value = `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`;
    }
  }
};

watch(() => props.name, load, { immediate: true });
</script>

<template>
  <div class="container">
    <el-avatar v-if="url" :src="url" size="small" />
    <el-avatar v-else-if="name" :icon="UserFilled" size="small" />
    <span v-if="showName && name" style="margin-left: 4px;">{{ name }}</span>
    <span v-else-if="showName && !name" style="margin-left: 4px;">-</span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
</style>
