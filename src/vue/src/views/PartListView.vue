<script setup lang="ts">
import { ElContainer, ElFooter, ElHeader, ElMain, ElPagination, ElTable, ElTableColumn } from "element-plus";
import { ref } from "vue";
import SearchBox from "../components/SearchBox.vue";
import ViewPage from "../components/ViewPage.vue";
import * as Part from "../stores/part";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;

const listSize = 20;

const listName = ref<string>("");
const listPage = ref<number>(1);
const listTotal = ref<number>(0);
const listParts = ref<Part.Part[]>([]);

const init = async () => {
  await list(listName.value, listPage.value);
};

const onSearch = async (name: string) => {
  listName.value = name;
  listPage.value = 1;
  await list(listName.value, listPage.value);
};

const onPageChange = async (page: number) => {
  listPage.value = page;
  await list(listName.value, listPage.value);
};

const list = async (name: string, page: number) => {
  const response = await Part.list({
    size: listSize,
    start: (page - 1) * listSize,
    name: name
  });
  listTotal.value = response.total;
  listParts.value = response.value;
};
</script>

<template>
  <view-page :title="strings.app.navigator.part" :init="init">
    <el-container>
      <el-header>
        <search-box :onSearch="onSearch" :value="listName" :placeholder="strings.views.part.searchByName" />
      </el-header>

      <el-main>
        <el-table :data="listParts">
          <el-table-column prop="name" :label="strings.part.name" />
        </el-table>
      </el-main>

      <el-footer>
        <el-pagination layout="prev, pager, next, total" :total="listTotal" :current-page="listPage"
          @update:current-page="onPageChange" :page-size="listSize" />
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

.el-main {
  padding-top: 0;
}

.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
