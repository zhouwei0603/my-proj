<script setup lang="ts">
import { publish } from '@/utils/Notification';
import { ElButton } from 'element-plus';
import * as _ from "lodash";
import ViewPage from "../components/ViewPage.vue";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;

async function init() {
  for (let index = 0; index < 10; ++index) {
    const seconds = _.random(1000, 60 * 1000);

    let promise: Promise<any>;

    if (seconds % 3 === 0) {
      promise = new Promise((_resolve, reject) => {
        _.delay(() => reject({ message: `A backend error occurred.` }), seconds);
      });
    } else {
      promise = new Promise((resolve, _reject) => {
        _.delay(() => resolve(`The operation was successfully completed.`), seconds);
      });
    }

    publish(plugin, {
      promise,
      failureTitle: `Error ID: ${index}`,
      failureMessage: `There was an unknown error occurred. \${ msg }`,
      successTitle: `Success ID: ${index}`,
      successMessage: `The operation was successfully completed.`,
      inProgressTitle: `In progress ID: ${index}`,
      inProgressMessage: `We are working on the operation.`
    });

    await new Promise((resolve) => {
      _.delay(() => resolve(undefined), 3 * 1000);
    });
  }
}
</script>

<template>
  <view-page :title="strings.app.navigator.overview">
    <div>
      <el-button @click="init">{{ "Notification" }}</el-button>
    </div>
  </view-page>
</template>
