<script setup lang="ts">
import { CircleCloseFilled, Close, More, SuccessFilled, InfoFilled } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElContainer,
  ElDrawer,
  ElEmpty,
  ElFooter,
  ElHeader,
  ElIcon,
  ElMain,
  ElRow,
  ElText
} from 'element-plus';
import * as _ from "lodash";
import { computed, ref, type Ref } from 'vue';
import { getAppPlugin } from "../utils/AppUtils";
import { removeAll } from "../utils/Notification";
import { NotificationState } from "../utils/NotificationCore";
import { toDisplayString } from "../utils/TimeSpan";

const plugin = getAppPlugin();
const strings = plugin.strings;
const drawer = defineModel<boolean>("drawer");

//// Updates data if notification changed
const data = computed(() => {
  const now = Date.now();

  return _.map(plugin.notifications.data, n => {
    let time = ``;

    if (n.publishTime) {
      const span = now - n.publishTime.getTime();
      time = toDisplayString(plugin, span);
    }

    const d: Datum = {
      id: n.id,
      title: n.title,
      message: n.message,
      time: time,
      state: n.state,
      publishTime: n.publishTime
    };

    return ref(d);
  });
});

//// Updates time per minute
setInterval(() => {
  if (data.value.length) {
    const now = Date.now();

    _.forEach(data.value, datum => {
      if (datum.value.publishTime) {
        const span = now - datum.value.publishTime.getTime();
        const text = toDisplayString(plugin, span);
        datum.value.time = text;
      }
    });
  }
}, 60 * 1000);

function clear() {
  removeAll(plugin);
}

function remove(id: string) {
  plugin.notifications.remove(n => n.id === id);
}

interface Datum {
  id: string;
  title: string;
  message: string;
  time: string;
  state: NotificationState;
  publishTime: Date | undefined;
}
</script>

<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h3><el-text size="large">{{ strings.app.notification.title }}</el-text></h3>
    </template>

    <template #default>
      <el-empty :description="strings.app.notification.emptyDescription" v-if="data.length === 0" />

      <div v-else>
        <el-row v-for="datum in data" :title="datum.value.title" class="app-notification">
          <el-container>
            <el-header height="30px">
              <el-row>
                <el-col :span="12" class="title">
                  <el-icon v-if="datum.value.state === NotificationState.InProgress" size="24" class="info">
                    <info-filled />
                  </el-icon>
                  <el-icon v-else-if="datum.value.state === NotificationState.Succeeded" size="24" class="success">
                    <success-filled />
                  </el-icon>
                  <el-icon v-else-if="datum.value.state === NotificationState.Failed" size="24" class="error">
                    <circle-close-filled />
                  </el-icon>
                  <h4><el-text size="default">{{ datum.value.title }}</el-text></h4>
                  <el-icon v-if="datum.value.state === NotificationState.InProgress">
                    <more />
                  </el-icon>
                </el-col>
                <el-col :span="12" class="commands">
                  <el-button :type="''" :icon="Close" link @click="remove(datum.value.id)"
                    :title="strings.app.notification.remove"></el-button>
                </el-col>
              </el-row>
            </el-header>

            <el-main>
              <p>{{ datum.value.message }}</p>
            </el-main>

            <el-footer height="30px">
              <p><el-text size="small">{{ datum.value.time }}</el-text></p>
            </el-footer>
          </el-container>
        </el-row>
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

<style scoped>
.app-notification {
  margin-bottom: 30px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.app-notification .el-header {
  padding: 0;
}

.app-notification .el-header .title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.app-notification .el-header .title h4 {
  margin: 0;
}

.app-notification .el-header .title .el-text {
  margin-left: 6px;
  margin-right: 6px;
}

.app-notification .el-header .title .el-icon.info {
  color: var(--el-color-info);
}

.app-notification .el-header .title .el-icon.error {
  color: var(--el-color-danger);
}

.app-notification .el-header .title .el-icon.success {
  color: var(--el-color-success);
}

.app-notification .el-header .commands {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.app-notification .el-main {
  padding: 0;
}

.app-notification .el-main p {
  margin: 0;
}

.app-notification .el-footer {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.app-notification .el-footer p {
  margin: 0;
}
</style>
