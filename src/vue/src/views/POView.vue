<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ViewPage from "../components/ViewPage.vue";
import * as PO from "../stores/po";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;

const route = useRoute();

const busy = ref<boolean>(false);
const operation = ref<"create" | "update">();

const po = ref<Pick<PO.PO, "title">>();

const load = async () => {
  try {
    busy.value = true;

    const id = route.params.id as string;
    if (id) {
      operation.value = "update";
      po.value = await PO.get(id);
    } else {
      operation.value = "create";
      po.value = {
        title: "",
      };
    }
  } finally {
    busy.value = false;
  }
};

watch(() => route.params.id, load, { immediate: true });
</script>

<template>
  <view-page :title="route.params.id ? strings.app.views.po.update : strings.app.views.po.create">
    <div v-loading="busy">{{ po?.title }}</div>
  </view-page>
</template>
