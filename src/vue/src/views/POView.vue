<script setup lang="ts">
import ViewPage from "../components/ViewPage.vue";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;
</script>

<template>
  <view-page :title="strings.app.views.po.create">
    <div></div>
  </view-page>
</template>
