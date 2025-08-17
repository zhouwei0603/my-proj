<script setup lang="ts">
import {
  ElButton,
  ElCol,
  ElRow,
  ElSelectV2,
  ElText,
  type SelectOptionProps
} from 'element-plus';
import { useId } from 'vue';
import { getAppPlugin } from "../utils/AppUtils";
import { SupportedLanguages } from "../utils/LocaleCore";

const plugin = getAppPlugin();
const strings = plugin.strings;

const drawer = defineModel<boolean>("drawer");

// Language settings

const language = plugin.language;

const languageId = useId();

const languageOptions: SelectOptionProps[] = [
  {
    value: SupportedLanguages.en,
    label: "English"
  },
  {
    value: SupportedLanguages.zhCn,
    label: "简体中文"
  }
];

function setLanguage(value: SupportedLanguages) {
  language.value = value;
}
</script>

<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h3><el-text size="large">{{ strings.app.settings.title }}</el-text></h3>
    </template>
    <template #default>
      <el-row class="field">
        <el-col class="label">
          <label :for="languageId">{{ strings.app.settings.language }}</label>
        </el-col>
        <el-col class="control">
          <el-select-v2 :id="languageId" :name="languageId" v-model="language" :options="languageOptions"
            @change="setLanguage" />
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">{{ strings.app.commands.close }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.field .label {
  padding: 0 0 5px 0;
}

.field .control {
  padding: 5px 0 0 0;
}
</style>
