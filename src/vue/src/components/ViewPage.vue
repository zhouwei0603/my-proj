<script setup lang="ts">
import { ElText } from 'element-plus';
import ViewPageInternal from './ViewPageInternal.vue';

const props = defineProps<{
  title: string,
  init?: () => Promise<any>
}>();

const init: (typeof props)["init"] = props.init || (() => Promise.resolve());
</script>

<template>
  <transition mode="out-in">
    <suspense>
      <!-- main content -->
      <div class="container">
        <h1 class="header">
          <el-text size="large">{{ props.title }}</el-text>
        </h1>
        <view-page-internal :init="init" class="content">
          <div>
            <slot name="default"></slot>
          </div>
        </view-page-internal>
      </div>

      <!-- loading state -->
      <template #fallback>
        <div v-loading="true" class="loading"></div>
      </template>
    </suspense>
  </transition>
</template>

<style scoped>
.container {
  padding: 10px 20px 20px 20px;
  height: calc(100vh - 110px);
}

.container .header {
  margin-top: 0;
  margin-bottom: 20px;
}

.container .content,
.container .content > div {
  height: calc(100vh - 160px);
}

.loading {
  width: 100%;
  height: 100%;
}
</style>
