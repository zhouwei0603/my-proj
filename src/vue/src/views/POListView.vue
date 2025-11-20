<script setup lang="ts">
import { Delete, Edit, Plus, Refresh } from "@element-plus/icons-vue";
import { ElButton, ElButtonGroup, ElCol, ElContainer, ElDivider, ElFooter, ElHeader, ElMain, ElMessageBox, ElPagination, ElRow, ElTable, ElTableColumn } from "element-plus";
import _ from "lodash";
import { ref } from "vue";
import { useRouter } from "vue-router";
import SearchBox from "../components/SearchBox.vue";
import TableDateColumn from "../components/TableDateColumn.vue";
import UserProfile from "../components/UserProfile.vue";
import ViewPage from "../components/ViewPage.vue";
import * as PO from "../stores/po";
import { getAppPlugin } from "../utils/AppUtils";
import { sleep } from "../utils/Common";
import { publish } from "../utils/Notification";
import { format } from "../utils/String";

const plugin = getAppPlugin();
const strings = plugin.strings;

const router = useRouter();

const pageSize = 15;

const searchTitle = ref<string>("");
const currentPage = ref<number>(1);
const recordsTotal = ref<number>(0);
const pagePOs = ref<PO.PO[]>([]);

const busy = ref<boolean>(false);

const selected = ref<PO.PO[]>([]);

const onTableSelectionChange = (val: PO.PO[]) => {
  selected.value = val;
};

const load = async () => {
  await list(searchTitle.value, currentPage.value);
};

const onSearch = async (name: string) => {
  searchTitle.value = name;
  currentPage.value = 1;
  await list(searchTitle.value, currentPage.value);
};

const onPageChange = async (page: number) => {
  currentPage.value = page;
  await list(searchTitle.value, currentPage.value);
};

const add = () => {
  router.push("/po");
};

const editFromToolbar = () => {
  router.push(`/po/${selected.value[0].id}`);
};

const editFromTableCommands = (po: PO.PO) => {
  router.push(`/po/${po.id}`);
};

const deleteFromToolbar = async () => {
  ElMessageBox.confirm(strings.value.views.po.confirmDelete, {
    type: "warning",
    confirmButtonText: strings.value.app.common.yes,
    cancelButtonText: strings.value.app.common.no,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  }).then(() => {
    try {
      busy.value = true;

      const promises: Promise<void>[] = [];

      for (const po of selected.value) {
        const promise = PO.remove(po.id);
        promises.push(promise);
        publish(plugin, {
          promise,
          failureTitle: strings.value.app.common.deleteErrorTitle,
          failureMessage: format(strings.value.views.po.deleteErrorMessage, { name: po.title }),
          successTitle: strings.value.app.common.deleteSuccessTitle,
          successMessage: format(strings.value.views.po.deleteSuccessMessage, { name: po.title }),
          inProgressTitle: strings.value.app.common.deleteInProgressTitle,
          inProgressMessage: format(strings.value.views.po.deleteInProgressMessage, { name: po.title }),
        });
        sleep(100); // Slight delay to avoid overwhelming the backend
      }

      Promise.all(promises).then(() => {
        currentPage.value = 1;
        load();
      });
    } finally {
      busy.value = false;
    }
  }, _.noop);
};

const deleteFromTableCommands = async (po: PO.PO) => {
  ElMessageBox.confirm(strings.value.views.po.confirmDelete, {
    type: "warning",
    confirmButtonText: strings.value.app.common.yes,
    cancelButtonText: strings.value.app.common.no,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  }).then(() => {
    try {
      busy.value = true;

      const promise = PO.remove(po.id);
      publish(plugin, {
        promise,
        failureTitle: strings.value.app.common.deleteErrorTitle,
        failureMessage: format(strings.value.views.po.deleteErrorMessage, { name: po.title }),
        successTitle: strings.value.app.common.deleteSuccessTitle,
        successMessage: format(strings.value.views.po.deleteSuccessMessage, { name: po.title }),
        inProgressTitle: strings.value.app.common.deleteInProgressTitle,
        inProgressMessage: format(strings.value.views.po.deleteInProgressMessage, { name: po.title }),
      });

      promise.then(() => {
        currentPage.value = 1;
        load();
      });
    } finally {
      busy.value = false;
    }
  }, _.noop);
};

const list = async (title: string, page: number) => {
  try {
    busy.value = true;

    const response = await PO.list({
      size: pageSize,
      start: (page - 1) * pageSize,
      title: title,
    });

    // Clear selection
    selected.value.splice(0, selected.value.length);

    recordsTotal.value = response.total;
    pagePOs.value.splice(0, pagePOs.value.length, ...response.value);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <view-page :title="strings.app.navigator.po" :init="load">
    <el-container v-loading="busy">
      <el-header>
        <el-row>
          <el-col :span="18" class="commands toolbar">
            <el-button-group>
              <el-button text type="primary" :icon="Refresh" :disabled="busy" @click="load">{{ strings.app.commands.refresh }}</el-button>
            </el-button-group>
            <el-divider direction="vertical" />
            <el-button-group>
              <el-button text type="primary" :icon="Plus" :disabled="busy" @click="add">{{ strings.app.commands.add }}</el-button>
              <el-button text type="primary" :icon="Edit" :disabled="busy || selected.length !== 1" @click="editFromToolbar">{{ strings.app.commands.edit }}</el-button>
              <el-button text type="danger" :icon="Delete" :disabled="busy || selected.length === 0" @click="deleteFromToolbar">{{ strings.app.commands.delete }}</el-button>
            </el-button-group>
          </el-col>
          <el-col :span="6" class="search">
            <search-box :onSearch="onSearch" :value="searchTitle" :placeholder="strings.views.po.searchByTitle" />
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-table :data="pagePOs" row-key="id" @selection-change="onTableSelectionChange">
          <el-table-column type="selection" width="45" />
          <el-table-column :label="strings.po.title">
            <template #default="scope">
              <router-link :to="`/po/${scope.row.id}`" class="router-link">{{ scope.row.title }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="strings.app.common.created">
            <template #default="scope">
              <table-date-column :date="scope.row.created" />
            </template>
          </el-table-column>
          <el-table-column :label="strings.app.common.createdBy">
            <template #default="scope">
              <user-profile :name="scope.row.createdBy" :show-name="true" />
            </template>
          </el-table-column>
          <el-table-column :label="strings.app.common.modified">
            <template #default="scope">
              <table-date-column :date="scope.row.modified" />
            </template>
          </el-table-column>
          <el-table-column :label="strings.app.common.modifiedBy">
            <template #default="scope">
              <user-profile :name="scope.row.modifiedBy" :show-name="true" />
            </template>
          </el-table-column>
          <el-table-column :label="strings.app.common.operation" width="120" align="center">
            <template #default="scope">
              <el-button-group class="toolbar">
                <el-button text type="primary" :icon="Edit" @click="editFromTableCommands(scope.row)"></el-button>
                <el-button text type="danger" :icon="Delete" @click="deleteFromTableCommands(scope.row)"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <el-pagination layout="prev, pager, next, total" :total="recordsTotal" :current-page="currentPage" @update:current-page="onPageChange" :page-size="pageSize" />
      </el-footer>
    </el-container>
  </view-page>
</template>

<style scoped>
.el-container {
  height: 100%;
}

.el-header,
.el-main,
.el-footer {
  padding-left: 0;
  padding-right: 0;
}

.el-header .commands {
  display: flex;
  align-items: center;
  justify-content: left;
}

.el-header .search {
  display: flex;
  align-items: center;
  justify-content: right;
}

.el-main {
  padding-top: 0;
}

.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
