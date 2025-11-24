<script setup lang="ts">
import { Male } from "@element-plus/icons-vue";
import { ElCol, ElIcon, ElRow, ElStatistic } from "element-plus";
import _ from "lodash";
import { reactive } from "vue";
import ViewPage from "../components/ViewPage.vue";
import { list as listPart } from "../stores/part";
import { list as listPO } from "../stores/po";
import { getAppPlugin } from "../utils/AppUtils";

const plugin = getAppPlugin();
const strings = plugin.strings;
const data = reactive({
  po: {
    total: 0,
    totalLoading: true,
    soldPartTypeTotal: 0,
    soldPartTypeTotalLoading: true,
    soldPartCountTotal: 0,
    soldPartCountTotalLoading: true,
  },
  part: {
    total: 0,
    totalLoading: true,
    soldTotal: 0,
    soldTotalLoading: true,
    unsoldTotal: 0,
    unsoldTotalLoading: true,
    bestSold: {
      loading: true,
      first: "",
      second: "",
      third: "",
    },
  },
});

const init = async () => {
  listPO().then((response) => {
    data.po.total = response.value.length;
    data.po.totalLoading = false;
  }, _.noop);

  listPart().then((response) => {
    data.part.total = response.value.length;
    data.part.totalLoading = false;
  }, _.noop);
};

init();
</script>

<template>
  <view-page :title="strings.app.navigator.overview">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="6" class="text-center mb-4">
        <el-statistic :value="data.po.total" v-loading="data.po.totalLoading">
          <template #title>
            {{ strings.views.home.poTotal }}
            <div style="display: inline-flex; align-items: center">
              <el-icon style="margin-left: 4px" :size="12">
                <male />
              </el-icon>
            </div>
          </template>
        </el-statistic>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" class="text-center mb-4">
        <el-statistic :value="data.part.total" v-loading="data.part.totalLoading">
          <template #title>
            {{ strings.views.home.partTotal }}
            <div style="display: inline-flex; align-items: center">
              <el-icon style="margin-left: 4px" :size="12">
                <male />
              </el-icon>
            </div>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </view-page>
</template>
