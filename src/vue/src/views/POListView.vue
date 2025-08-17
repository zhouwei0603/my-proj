<script setup lang="ts">
import { ref } from "vue";
import ViewPage from "../components/ViewPage.vue";
import * as PO from "../stores/po";
import { strings } from "../utils/Locale";

const pos = ref<PO.PO[]>([]);

const init = async () => {
  const all = await PO.list();
  pos.value.push(...all);
};
</script>

<template>
  <view-page :title="strings.app.navigator.po" :init="init">
    <pre>{{ JSON.stringify(pos, undefined, 4) }}</pre>
  </view-page>
</template>
