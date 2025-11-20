<script setup lang="ts">
import { ElOption, ElSelect, ElText } from "element-plus";
import _ from "lodash";
import { ref, watch } from "vue";
import * as Part from "../stores/part";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;
const loadingOptions = ref<boolean>(false);
const loadingSelected = ref<boolean>(false);
const parts = ref<Part.Part[]>([]);
const selectedId = defineModel<string>();
const selectedPart = ref<Part.Part>();

const loadOptions = async (input: string) => {
  if (input) {
    try {
      loadingOptions.value = true;

      const response = await Part.list(input);
      parts.value = response.value;
    } finally {
      loadingOptions.value = false;
    }
  } else {
    parts.value = [];
  }
};

watch(selectedId, async (id) => {
  if (id) {
    let found = _.find(parts.value, (p) => p.id === id);

    if (!found) {
      try {
        loadingSelected.value = true;
        found = await Part.get(id);
        parts.value.push(found);
      } finally {
        loadingSelected.value = false;
      }
    }

    selectedPart.value = found;
  }
});
</script>

<template>
  <el-select v-model="selectedId" filterable remote :remote-method="loadOptions" :loading="loadingOptions" :disabled="loadingSelected" :loading-text="strings.app.common.loading" :placeholder="strings.views.part.selectFilterPlaceholder">
    <template #label>
      {{ selectedPart?.name || selectedId }}
    </template>
    <template #empty>
      <el-text type="info">{{ strings.views.part.selectNoDataText }}</el-text>
    </template>
    <el-option v-for="part in parts" :key="part.id" :label="part.name" :value="part.id" />
  </el-select>
</template>

<style scoped>
.el-select {
  width: 100%;
}
</style>
