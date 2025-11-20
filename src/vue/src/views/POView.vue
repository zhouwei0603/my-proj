<script setup lang="ts">
import { Delete, Edit, Plus, Refresh } from "@element-plus/icons-vue";
import { type FormInstance, type FormRules, ElButton, ElButtonGroup, ElContainer, ElDivider, ElFooter, ElForm, ElFormItem, ElInput, ElMain, ElMessageBox, ElPagination, ElRow, ElTable, ElTableColumn, ElText } from "element-plus";
import _ from "lodash";
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import POItemDrawer, { type POItemViewModel } from "../components/POItemDrawer.vue";
import ViewPage from "../components/ViewPage.vue";
import router from "../router";
import { type Part, get as getPart } from "../stores/part";
import { type PO, create as createPO, get as getPO } from "../stores/po";
import { type POItem, create as createPOItem, list as listPOItems, remove as removePOItem } from "../stores/poitem";
import { getAppPlugin } from "../utils/AppUtils";
import { Operation, sleep } from "../utils/Common";
import { publish } from "../utils/Notification";
import { format } from "../utils/String";
import * as Validation from "../utils/Validation";

// Common fields
const plugin = getAppPlugin();
const strings = plugin.strings;
const route = useRoute();
const formInstance = ref<FormInstance>();
const saving = ref<boolean>(false);
const loading = ref<boolean>(false);
const operation = ref<Operation.StandaloneCreate | Operation.StandaloneUpdate>(route.params.id ? Operation.StandaloneUpdate : Operation.StandaloneCreate);

// PO fields
const po = ref<Omit<PO, "created" | "createdBy" | "modified" | "modifiedBy">>({
  id: "",
  title: "",
});
const rules = reactive<FormRules<PO>>(
  Validation.getPORules(plugin, {
    operation: operation.value,
  })
);

// PO item fields
const pageSize = 15;
const currentPage = ref<number>(1);
const recordsTotal = ref<number>(0);
const poitems = ref<POItem[]>([]);
const cachedParts = ref<Part[]>([]); // For displaying part names
const selectedPOItems = ref<POItem[]>([]); // For multi-selection
const editingPOItem = reactive<Omit<POItem, "poid" | "created" | "createdBy" | "modified" | "modifiedBy">>({
  id: "",
  count: 1,
  partid: "",
}); // For editing
const poitemDrawerPOId = ref<string>();
const poitemDrawerPOItemId = ref<string>();
const poitemDrawerPOItems = ref<POItem[]>();
const poitemDrawerPOItem = ref<Omit<POItem, "poid" | "created" | "createdBy" | "modified" | "modifiedBy">>();
const poitemDrawer = ref<boolean>(false);
const poitemOperation = ref<Operation>();

// Common methods

const load = async () => {
  try {
    loading.value = true;

    await Promise.all([loadPO(), loadPOItems(currentPage.value, true)]);
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  saving.value = true;

  try {
    const valid = await formInstance.value?.validate();

    if (valid) {
      const poPromise = createPO({
        title: po.value.title,
      });

      publish(plugin, {
        promise: poPromise,
        failureTitle: strings.value.app.common.createErrorTitle,
        failureMessage: format(strings.value.views.po.createErrorMessage, { name: po.value.title }),
        successTitle: strings.value.app.common.createSuccessTitle,
        successMessage: format(strings.value.views.po.createSuccessMessage, { name: po.value.title }),
        inProgressTitle: strings.value.app.common.createInProgressTitle,
        inProgressMessage: format(strings.value.views.po.createInProgressMessage, { name: po.value.title }),
      });

      await poPromise;

      await Promise.all(
        poitems.value.map(async (poitem) => {
          const poitemPromise = createPOItem({
            poid: poitem.poid,
            partid: poitem.partid,
            count: poitem.count,
          });

          publish(plugin, {
            promise: poitemPromise,
            failureTitle: strings.value.app.common.createErrorTitle,
            failureMessage: format(strings.value.views.poitem.createErrorMessage, { partName: partFormatter(poitem) }),
            successTitle: strings.value.app.common.createSuccessTitle,
            successMessage: format(strings.value.views.poitem.createSuccessMessage, { partName: partFormatter(poitem) }),
            inProgressTitle: strings.value.app.common.createInProgressTitle,
            inProgressMessage: format(strings.value.views.poitem.createInProgressMessage, { partName: partFormatter(poitem) }),
          });

          sleep(100); // Slight delay to avoid overwhelming the backend
        })
      );

      router.back();
    }
  } finally {
    saving.value = false;
  }
};

const close = () => {
  router.back();
};

// PO methods

const loadPO = async () => {
  if (operation.value === Operation.StandaloneUpdate) {
    po.value = await getPO(route.params.id as string);
  }
};

// PO item methods

const loadPOItems = async (page: number, initializing: boolean) => {
  try {
    if (!initializing) {
      loading.value = true;
    }

    setEditingPOItem();
    selectedPOItems.value = [];

    if (operation.value === Operation.StandaloneUpdate) {
      // Load PO items
      currentPage.value = page;
      const response = await listPOItems(route.params.id as string, {
        size: pageSize,
        start: (page - 1) * pageSize,
      });
      recordsTotal.value = response.total;
      poitems.value.splice(0, poitems.value.length, ...response.value);

      // Load parts
      const partIds = _.uniq(
        _.filter(
          _.map(poitems.value, (poitem) => poitem.partid),
          (partid) => !_.some(cachedParts.value, (part) => part.id === partid)
        )
      );
      const parts = await Promise.all(
        _.map(partIds, async (partid) => {
          try {
            return await getPart(partid);
          } catch {
            // Ignore errors for part
          }
        })
      );
      cachedParts.value.push(...(_.filter(parts, (part) => part) as Part[]));
    }
  } finally {
    if (!initializing) {
      loading.value = false;
    }
  }
};

const setEditingPOItem = (source?: POItemViewModel) => {
  if (source) {
    editingPOItem.id = source.id;
    editingPOItem.count = source.count;
    editingPOItem.partid = source.partid;
  } else {
    editingPOItem.id = "";
    editingPOItem.count = 1;
    editingPOItem.partid = "";
  }
};

const partFormatter = (row: POItem) => {
  const part = _.find(cachedParts.value, (p) => p.id === row.partid);
  return part ? part.name : row.partid;
};

const onPOItemPageChange = async (page: number) => {
  await loadPOItems(page, false);
};

const onPOItemSelectionChange = (val: POItem[]) => {
  selectedPOItems.value = val;
};

const onPOItemClosed = async (result?: POItemViewModel) => {
  if (result) {
    setEditingPOItem(result);
    poitemDrawerPOId.value = undefined;
    poitemDrawerPOItemId.value = undefined;
    poitemDrawerPOItem.value = undefined;
    poitemDrawerPOItems.value = undefined;
    await loadPOItems(1, false);
  }
};

const addPOItem = () => {
  setEditingPOItem();
  switch (operation.value) {
    case Operation.StandaloneCreate:
      poitemOperation.value = Operation.InlineCreate;
      poitemDrawerPOId.value = undefined;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = poitems.value;
      break;
    case Operation.StandaloneUpdate:
      poitemOperation.value = Operation.StandaloneCreate;
      poitemDrawerPOId.value = po.value.id;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = undefined;
      break;
  }
  poitemDrawer.value = true;
};

const editPOItem = (current: POItem) => {
  setEditingPOItem(current);
  switch (operation.value) {
    case Operation.StandaloneCreate:
      poitemOperation.value = Operation.InlineUpdate;
      poitemDrawerPOId.value = undefined;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = editingPOItem;
      poitemDrawerPOItems.value = poitems.value;
      break;
    case Operation.StandaloneUpdate:
      poitemOperation.value = Operation.StandaloneUpdate;
      poitemDrawerPOId.value = po.value.id;
      poitemDrawerPOItemId.value = editingPOItem.id;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = undefined;
      break;
  }
  poitemDrawer.value = true;
};

const deletePOItems = async (...poitems: POItem[]) => {
  ElMessageBox.confirm(strings.value.views.poitem.confirmDelete, {
    type: "warning",
    confirmButtonText: strings.value.app.common.yes,
    cancelButtonText: strings.value.app.common.no,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  }).then(async () => {
    try {
      saving.value = true;

      await Promise.all(
        _.map(poitems, (poitem) => {
          const promise = removePOItem(poitem.id);

          publish(plugin, {
            promise: promise,
            failureTitle: strings.value.app.common.deleteErrorTitle,
            failureMessage: format(strings.value.views.poitem.deleteErrorMessage, { partName: partFormatter(poitem) }),
            successTitle: strings.value.app.common.deleteSuccessTitle,
            successMessage: format(strings.value.views.poitem.deleteSuccessMessage, { partName: partFormatter(poitem) }),
            inProgressTitle: strings.value.app.common.deleteInProgressTitle,
            inProgressMessage: format(strings.value.views.poitem.deleteInProgressMessage, { partName: partFormatter(poitem) }),
          });

          return promise;
        })
      );

      await loadPOItems(1, false);
    } finally {
      saving.value = false;
    }
  }, _.noop);
};
</script>

<template>
  <view-page :title="operation === Operation.StandaloneUpdate ? strings.app.views.po.update : strings.app.views.po.create" :init="load">
    <el-container v-loading="loading">
      <el-main>
        <el-form :model="po" :rules="rules" label-width="auto">
          <el-form-item :label="strings.po.title" prop="title">
            <el-input v-model="po.title" :disabled="operation === Operation.StandaloneUpdate" :maxlength="Validation.POTitleMaxLength" show-word-limit />
          </el-form-item>
        </el-form>
        <el-row>
          <el-text>{{ strings.views.po.poItems }}</el-text>
        </el-row>
        <el-row class="commands toolbar">
          <el-button-group v-if="operation === Operation.StandaloneUpdate">
            <el-button text type="primary" :icon="Refresh" @click="loadPOItems(currentPage, false)">{{ strings.app.commands.refresh }}</el-button>
          </el-button-group>
          <el-divider direction="vertical" v-if="operation === Operation.StandaloneUpdate" />
          <el-button-group>
            <el-button text type="primary" :icon="Plus" @click="addPOItem">{{ strings.app.commands.add }}</el-button>
            <el-button text type="primary" :disabled="selectedPOItems.length !== 1" :icon="Edit" @click="editPOItem(selectedPOItems[0])">{{ strings.app.commands.edit }}</el-button>
            <el-button text type="danger" :disabled="selectedPOItems.length === 0" :icon="Delete" @click="deletePOItems(...selectedPOItems)">{{ strings.app.commands.delete }}</el-button>
          </el-button-group>
        </el-row>
        <el-row>
          <el-table :data="poitems" row-key="id" @selection-change="onPOItemSelectionChange">
            <el-table-column type="selection" width="45" />
            <el-table-column prop="partid" :label="strings.part.fullName" :formatter="partFormatter" />
            <el-table-column prop="count" :label="strings.views.poitem.count" align="right" />
            <el-table-column :label="strings.app.common.operation" width="120" align="center">
              <template #default="scope">
                <el-button-group class="toolbar">
                  <el-button text type="primary" :icon="Edit" @click="editPOItem(scope.row)"></el-button>
                  <el-button text type="danger" :icon="Delete" @click="deletePOItems(scope.row)"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <POItemDrawer v-model="poitemDrawer" :operation="poitemOperation!" :poitems="poitemDrawerPOItems" :poitem="poitemDrawerPOItem" :poid="poitemDrawerPOId" :poitemid="poitemDrawerPOItemId" @closed="onPOItemClosed" />
        </el-row>
        <el-row class="pagination-container">
          <el-pagination :current-page="currentPage" :page-size="pageSize" :total="recordsTotal" layout="prev, pager, next, total" @current-change="onPOItemPageChange" />
        </el-row>
      </el-main>
      <el-footer>
        <el-button type="primary" @click="create" v-if="operation === Operation.StandaloneCreate" :loading="saving" :disabled="loading">{{ saving ? strings.app.common.adding : strings.app.commands.add }}</el-button>
        <el-button @click="close" v-if="operation === Operation.StandaloneCreate">{{ strings.app.commands.cancel }}</el-button>
        <el-button @click="close" v-if="operation === Operation.StandaloneUpdate">{{ strings.app.commands.close }}</el-button>
      </el-footer>
    </el-container>
  </view-page>
</template>

<style scoped>
.el-container {
  height: 100%;
}

.el-main,
.el-footer {
  padding-left: 0;
  padding-right: 0;
}

.el-form {
  max-width: 600px;
}

.el-row {
  width: 100%;
}

.pagination-container {
  align-items: center;
  justify-content: center;
}

.el-pagination {
  margin-top: 12px;
}

.commands {
  align-items: center;
  justify-content: left;
  margin-top: 8px;
  margin-bottom: 8px;
}

.el-table {
  line-height: normal;
}
</style>
