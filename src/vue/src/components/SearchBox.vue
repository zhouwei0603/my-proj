<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ElInput } from 'element-plus';
import * as _ from "lodash";
import { ref } from 'vue';

const newProps = defineProps<{
  value?: string,
  onSearch: (value: string) => Promise<any>,
  placeholder?: string,
}>();

const value = ref<string>(newProps.value ?? "");
const lastChangeTime = ref<number>(_.now());
const searchPromise = ref<Promise<any>>();

const onChange = _.debounce((val: string) => {
  const now = _.now();

  if (now - lastChangeTime.value > 300) {
    lastChangeTime.value = now;

    if (searchPromise.value) {
      searchPromise.value = undefined;
    }

    searchPromise.value = newProps.onSearch(val);
  }
}, 300);
</script>

<template>
  <el-input v-model="value" :prefix-icon="Search" :placeholder="newProps.placeholder" @change="onChange"
    inputmode="search" clearable />
</template>
