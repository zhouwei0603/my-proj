<script setup lang="ts">
import { ref } from "vue";
import ViewPage from "../components/ViewPage.vue";
import * as Part from "../stores/part";
import { strings } from "../utils/Locale";

const parts = ref<Part.Part[]>([]);

const init = async () => {
  const all = await Part.list();
  parts.value.push(...all);
};
</script>

<template>
  <view-page :title="strings.app.navigator.part" :init="init">
    <pre>{{ JSON.stringify(parts, undefined, 4) }}</pre>
  </view-page>
</template>
