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
      <div class="content">
        <h1>
          <el-text size="large">{{ props.title }}</el-text>
        </h1>
        <view-page-internal :init="init">
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
.content {
  padding: 10px 20px 20px 20px;
}

.content h1 {
  margin-top: 0;
}

.loading {
  width: 100%;
  height: 100%;
}
</style>
