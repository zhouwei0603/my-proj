<script setup lang="ts">
import { publish } from '@/utils/Notification';
import { ElButton } from 'element-plus';
import * as _ from "lodash";
import ViewPage from "../components/ViewPage.vue";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;

function init() {
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
      failureTitle: `Error`,
      failureMessage: `There was an unknown error occurred. ID: ${index} \${ msg }`,
      successTitle: `Success`,
      successMessage: `The operation was successfully completed. ID: ${index}`,
      inProgressTitle: `In progress`,
      inProgressMessage: `We are working on the operation. ID: ${index}`
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
