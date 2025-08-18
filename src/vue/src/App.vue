<script setup lang="ts">
import { Bell, Collection, Document, Files, HelpFilled, HomeFilled, House, Management, Setting } from '@element-plus/icons-vue';
import {
  ElButton,
  ElConfigProvider,
  ElContainer,
  ElHeader,
  ElIcon,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElScrollbar,
  ElSplitter,
  ElSplitterPanel,
  ElSubMenu,
  ElText
} from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { computed, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppNotifications from "./components/AppNotifications.vue";
import AppSettings from "./components/AppSettings.vue";
import { getAppPlugin } from "./utils/AppUtils";
import { SupportedLanguages } from "./utils/LocaleCore";

const plugin = getAppPlugin();
const strings = plugin.strings;
const language = plugin.language;
const locale = computed(() => (language.value === SupportedLanguages.zhCn ? zhCn : en));

const settingsDrawer = ref(false);
const notificationDrawer = ref(false);

const menus = new Map<string, string>([
  ["/", "1"],
  ["management", "2"],
  ["/polist", "2-1"],
  ["/partlist", "2-2"],
  ["help", "3"],
  ["/help", "3-1"],
  ["/about", "3-2"],
]);
function getCurrentActive() {
  const route = useRoute();
  return menus.get(route.path.toLowerCase());
}

const iconSize = 24;
</script>

<template>
  <el-config-provider :locale="locale">
    <el-container class="app-layout">
      <el-header class="app-header">
        <el-button :type="''" :icon="Bell" link @click="notificationDrawer = true"
          :title="strings.app.header.notification"></el-button>
        <el-button :type="''" :icon="Setting" link @click="settingsDrawer = true"
          :title="strings.app.header.settings"></el-button>
        <el-text>Wei Zhou</el-text>
      </el-header>

      <el-main class="app-main">
        <el-splitter>
          <el-splitter-panel size="200px">
            <el-scrollbar>
              <el-menu router :default-active="getCurrentActive()" :default-openeds="['1', '2', '3']"
                class="app-navigator">
                <el-menu-item :index="menus.get('/')" route="/" :title="strings.app.navigator.overview">
                  <template #title>
                    <el-icon :size="iconSize">
                      <home-filled />
                    </el-icon>
                    <span>{{ strings.app.navigator.overview }}</span>
                  </template>
                </el-menu-item>
                <el-sub-menu :index="menus.get('management') as string" :title="strings.app.navigator.management">
                  <template #title>
                    <el-icon :size="iconSize">
                      <management />
                    </el-icon>
                    <span>{{ strings.app.navigator.management }}</span>
                  </template>
                  <el-menu-item :index="menus.get('/polist')" route="/polist" :title="strings.app.navigator.po">
                    <template #title>
                      <el-icon :size="iconSize">
                        <collection />
                      </el-icon>
                      <span>{{ strings.app.navigator.po }}</span>
                    </template>
                  </el-menu-item>
                  <el-menu-item :index="menus.get('/partlist')" route="/partlist" :title="strings.app.navigator.part">
                    <template #title>
                      <el-icon :size="iconSize">
                        <files />
                      </el-icon>
                      <span>{{ strings.app.navigator.part }}</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>
                <el-sub-menu :index="menus.get('help') as string" :title="strings.app.navigator.help">
                  <template #title>
                    <el-icon :size="iconSize">
                      <help-filled />
                    </el-icon>
                    <span>{{ strings.app.navigator.help }}</span>
                  </template>
                  <el-menu-item :index="menus.get('/help')" route="/help" :title="strings.app.navigator.document">
                    <template #title>
                      <el-icon :size="iconSize">
                        <document />
                      </el-icon>
                      <span>{{ strings.app.navigator.document }}</span>
                    </template>
                  </el-menu-item>
                  <el-menu-item :index="menus.get('/about')" route="/about" :title="strings.app.navigator.about">
                    <template #title>
                      <el-icon :size="iconSize">
                        <house />
                      </el-icon>
                      <span>{{ strings.app.navigator.about }}</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </el-splitter-panel>
          <el-splitter-panel :min="200">
            <router-view />
          </el-splitter-panel>
        </el-splitter>
      </el-main>
    </el-container>

    <app-settings v-model:drawer="settingsDrawer" />
    <app-notifications v-model:drawer="notificationDrawer" />
  </el-config-provider>
</template>

<style scoped>
.app-layout {
  background-color: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  height: 100vh;
}

.app-layout .app-main {
  margin: 0;
  padding-top: 0;
  padding-left: 0;
}

.app-layout .app-navigator {
  border-right: none;
}

.app-layout .app-navigator .el-icon {
  margin-right: 10px;
}

.app-layout .app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.app-layout .app-header .el-button+.el-button {
  margin-left: 6px;
  margin-right: 6px;
}
</style>
