<script setup lang="ts">
import { ElButton, ElCol, ElContainer, ElFooter, ElHeader, ElMain, ElPagination, ElRow, ElTable, ElTableColumn } from "element-plus";
import { ref } from "vue";
import SearchBox from "../components/SearchBox.vue";
import ViewPage from "../components/ViewPage.vue";
import * as Part from "../stores/part";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;

const pageSize = 20;

const searchName = ref<string>("");
const currentPage = ref<number>(1);
const recordsTotal = ref<number>(0);
const pageParts = ref<Part.Part[]>([]);

const busy = ref<boolean>(false);

const init = async () => {
  await list(searchName.value, currentPage.value);
};

const onSearch = async (name: string) => {
  searchName.value = name;
  currentPage.value = 1;
  await list(searchName.value, currentPage.value);
};

const onPageChange = async (page: number) => {
  currentPage.value = page;
  await list(searchName.value, currentPage.value);
};

const list = async (name: string, page: number) => {
  try {
    busy.value = true;

    const response = await Part.list({
      size: pageSize,
      start: (page - 1) * pageSize,
      name: name
    });

    recordsTotal.value = response.total;
    pageParts.value.splice(0, pageParts.value.length, ...response.value);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <view-page :title="strings.app.navigator.part" :init="init">
    <el-container v-loading="busy">
      <el-header>
        <el-row>
          <el-col :span="18" class="commands">
            <el-button type="primary" :disabled="busy" @click="init">{{ strings.app.commands.refresh }}</el-button>
          </el-col>
          <el-col :span="6" class="search">
            <search-box :onSearch="onSearch" :value="searchName" :placeholder="strings.views.part.searchByName" />
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-table :data="pageParts">
          <el-table-column prop="name" :label="strings.part.name" />
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
