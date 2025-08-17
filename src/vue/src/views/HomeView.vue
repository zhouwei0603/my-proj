<script setup lang="ts">
import { publish } from '@/utils/Notification';
import { ElButton } from 'element-plus';
import * as _ from "lodash";
import { inject } from 'vue';
import ViewPage from "../components/ViewPage.vue";
import { getStrings } from "../utils/Locale";
import { key, type NotificationType } from "../utils/Notification";

const strings = getStrings();

const source = inject<NotificationType>(key) as NotificationType;

const init = async () => {
  for (let index = 0; index < 10; ++index) {
    const seconds = _.random(1000, 10000);

    let promise: Promise<any>;

    if (seconds % 3 === 0) {
      promise = new Promise((_resolve, reject) => {
        _.delay(() => reject({ message: `` }), seconds);
      });
    } else {
      promise = new Promise((resolve, _reject) => {
        _.delay(() => resolve(`The operation was successfully completed.`), seconds);
      });
    }

    publish(source, {
      promise,
      failureTitle: `Error`,
      failureMessage: `There was an unknown error occurred. ID: ${index} {{ msg }}`,
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
