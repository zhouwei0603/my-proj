<script setup lang="ts">
import { CircleCloseFilled, MoreFilled, SuccessFilled } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElDrawer,
  ElEmpty,
  ElIcon,
  ElRow,
  ElText
} from 'element-plus';
import * as _ from "lodash";
import { computed } from 'vue';
import { getAppPlugin } from "../utils/AppUtils";
import { removeAll } from "../utils/Notification";
import { NotificationState, type Notification } from "../utils/NotificationCore";
import { toDisplayString } from "../utils/TimeSpan";

const plugin = getAppPlugin();
const strings = plugin.strings;
const drawer = defineModel<boolean>("drawer");

// Updates the data if notification changed
const data = computed(() => {
  const now = Date.now();

  return _.map(plugin.notifications.value.data, n => {
    let time = ``;

    if (n.publishTime) {
      const span = now - n.publishTime.getTime();
      time = toDisplayString(plugin, span);
    }

    const d: Datum = {
      title: n.title,
      message: n.message,
      time: time,
      state: n.state,
      notification: n
    };

    return d;
  });
});

// Updates time per minute
setInterval(() => {
  if (data.value.length) {
    const now = Date.now();

    _.forEach(data.value, datum => {
      if (datum.notification.publishTime) {
        const span = now - datum.notification.publishTime.getTime();
        const text = toDisplayString(plugin, span);
        datum.time = text;
      }
    });
  }
}, 60 * 1000);

function clear() {
  removeAll(plugin);
}

interface Datum {
  title: string;
  message: string;
  time: string;
  state: NotificationState;
  notification: Notification;
}
</script>

<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h3><el-text size="large">{{ strings.app.notification.title }}</el-text></h3>
    </template>

    <template #default>
      <div>
        <el-empty :description="strings.app.notification.emptyDescription" v-if="data.length === 0" />

        <el-collapse v-else>
          <el-collapse-item v-for="datum in data" :title="datum.title">
            <el-row>
              <el-col :span="12">
                <template #title>
                  <div>
                    <el-text size="default">{{ datum.title }}</el-text>
                    <el-icon>
                      <more-filled v-if="datum.state === NotificationState.InProgress" />
                      <success-filled v-if="datum.state === NotificationState.Succeeded" />
                      <circle-close-filled v-if="datum.state === NotificationState.Failed" />
                    </el-icon>
                  </div>
                </template>
              </el-col>
              <el-col :span="12">
                <span>{{ datum.time }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <pre>{{ datum.message }}</pre>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="clear" type="primary" :disabled="data.length === 0">
          {{ strings.app.notification.removeAllButton }}
        </el-button>
        <el-button @click="drawer = false">
          {{ strings.app.commands.close }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
