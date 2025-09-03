<script setup lang="ts">
import { ElButton, ElCol, ElContainer, ElFooter, ElHeader, ElMain, ElMessageBox, ElPagination, ElRow, ElTable, ElTableColumn } from "element-plus";
import _ from "lodash";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ProfilePicture from "../components/ProfilePicture.vue";
import SearchBox from "../components/SearchBox.vue";
import ViewPage from "../components/ViewPage.vue";
import * as PO from "../stores/po";
import { getAppPlugin } from "../utils/AppUtils";
import { publish } from "../utils/Notification";
import { format } from "../utils/String";

const plugin = getAppPlugin();
const strings = plugin.strings;

const router = useRouter();

const pageSize = 20;

const searchTitle = ref<string>("");
const currentPage = ref<number>(1);
const recordsTotal = ref<number>(0);
const pagePOs = ref<PO.PO[]>([]);

const busy = ref<boolean>(false);

const selected = ref<PO.PO[]>([]);

const onTableSelectionChange = (val: PO.PO[]) => {
  selected.value = val;
};

const init = async () => {
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

const create = () => {
  router.push("/po");
};

const update = () => {
  router.push(`/po/${selected.value[0].id}`);
};

const remove = async () => {
  ElMessageBox.confirm(
    strings.value.views.po.confirmDelete,
    {
      type: "warning",
      confirmButtonText: strings.value.app.common.yes,
      cancelButtonText: strings.value.app.common.no,
      closeOnClickModal: false,
      closeOnPressEscape: false,
    }
  ).then(() => {
    try {
      busy.value = true;

      const promises: Promise<void>[] = [];

      for (const po of selected.value) {
        const promise = new Promise<void>(resolve => setTimeout(resolve, 30 * 1000));
        // TODO: enable real delete
        // const promise = PO.remove(po.id);
        promises.push(promise);
        publish(plugin, {
          promise,
          failureTitle: strings.value.views.deleteErrorTitle,
          failureMessage: format(strings.value.views.po.deleteErrorMessage, { name: po.title }),
          successTitle: strings.value.views.deleteSuccessTitle,
          successMessage: format(strings.value.views.po.deleteSuccessMessage, { name: po.title }),
          inProgressTitle: strings.value.views.deleteInProgressTitle,
          inProgressMessage: format(strings.value.views.po.deleteInProgressMessage, { name: po.title }),
        });
      }

      Promise.all(promises).then(() => {
        selected.value.splice(0, selected.value.length);
        init();
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
      title: title
    });

    recordsTotal.value = response.total;
    pagePOs.value.splice(0, pagePOs.value.length, ...response.value);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <view-page :title="strings.app.navigator.po" :init="init">
    <el-container v-loading="busy">
      <el-header>
        <el-row>
          <el-col :span="18" class="commands">
            <el-button type="primary" :disabled="busy" @click="init">{{ strings.views.refresh }}</el-button>
            <el-button type="primary" :disabled="busy" @click="create">{{ strings.views.po.create }}</el-button>
            <el-button type="primary" :disabled="busy || selected.length !== 1" @click="update">{{
              strings.views.po.update }}</el-button>
            <el-button type="danger" :disabled="busy || selected.length === 0" @click="remove">{{
              strings.views.po.delete }}</el-button>
          </el-col>
          <el-col :span="6" class="search">
            <search-box :onSearch="onSearch" :value="searchTitle" :placeholder="strings.views.po.searchByTitle" />
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-table :data="pagePOs" row-key="id" @selection-change="onTableSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column :label="strings.po.title">
            <template #default="scope">
              <router-link :to="`/po/${scope.row.id}`" class="router-link">{{ scope.row.title }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="strings.views.created">
            <template #default="scope">
              {{ new Date(scope.row.created).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column :label="strings.views.createdBy">
            <template #default="scope">
              <profile-picture :name="scope.row.createdBy" :show-name="true" />
            </template>
          </el-table-column>
          <el-table-column :label="strings.views.modified">
            <template #default="scope">
              {{ scope.row.modified ? new Date(scope.row.modified).toLocaleString() : "-" }}
            </template>
          </el-table-column>
          <el-table-column :label="strings.views.modifiedBy">
            <template #default="scope">
              <profile-picture :name="scope.row.modifiedBy" :show-name="true" />
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <el-pagination layout="prev, pager, next, total" :total="recordsTotal" :current-page="currentPage"
          @update:current-page="onPageChange" :page-size="pageSize" />
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
