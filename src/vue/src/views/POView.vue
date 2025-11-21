<script setup lang="ts">
import { Delete, Edit, Plus, Refresh } from "@element-plus/icons-vue";
import { type FormInstance, type FormRules, ElButton, ElButtonGroup, ElContainer, ElDivider, ElFooter, ElForm, ElFormItem, ElInput, ElMain, ElMessageBox, ElPagination, ElRow, ElTable, ElTableColumn, ElText } from "element-plus";
import _ from "lodash";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import POItemDrawer, { type POItemViewModel } from "../components/POItemDrawer.vue";
import TableLazyColumn from "../components/TableLazyColumn.vue";
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
const poitems = ref<POItemTableRow[]>([]);
const cachedParts = ref<Part[]>([]); // For displaying part names
const selectedPOItems = ref<POItemTableRow[]>([]); // For multi-selection
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

      const newPO = await poPromise;

      await Promise.all(
        _.map(poitems.value, async (poitem) => {
          const partName = await formatPart(poitem);

          const poitemPromise = createPOItem({
            poid: newPO.id,
            partid: poitem.partid,
            count: poitem.count,
          });

          publish(plugin, {
            promise: poitemPromise,
            failureTitle: strings.value.app.common.createErrorTitle,
            failureMessage: format(strings.value.views.poitem.createErrorMessage, { partName }),
            successTitle: strings.value.app.common.createSuccessTitle,
            successMessage: format(strings.value.views.poitem.createSuccessMessage, { partName }),
            inProgressTitle: strings.value.app.common.createInProgressTitle,
            inProgressMessage: format(strings.value.views.poitem.createInProgressMessage, { partName }),
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

    selectedPOItems.value = [];

    if (operation.value === Operation.StandaloneUpdate) {
      currentPage.value = page;
      const response = await listPOItems(route.params.id as string, {
        size: pageSize,
        start: (page - 1) * pageSize,
      });
      recordsTotal.value = response.total;
      poitems.value.splice(0, poitems.value.length, ..._.map(response.value, poitem => {
        return {
          ...poitem,
          getPartNamePromise: formatPart(poitem),
        };
      }));
    }
  } finally {
    if (!initializing) {
      loading.value = false;
    }
  }
};

const formatPart = async (poitem: Pick<POItem, "partid">) => {
  let part = _.find(cachedParts.value, (p) => p.id === poitem.partid);

  if (!part) {
    try {
      part = await getPart(poitem.partid);
      cachedParts.value.push(part);
    } catch {
      // Ignore errors for part
    }
  }

  return part ? part.name : poitem.partid;
};

const onPOItemPageChange = async (page: number) => {
  await loadPOItems(page, false);
};

const onPOItemSelectionChange = (val: POItemTableRow[]) => {
  selectedPOItems.value = val;
};

const onPOItemClosed = async (result?: POItemViewModel) => {
  if (result) {
    // Clear drawer state
    poitemDrawerPOId.value = undefined;
    poitemDrawerPOItemId.value = undefined;
    poitemDrawerPOItem.value = undefined;
    poitemDrawerPOItems.value = undefined;

    switch(poitemOperation.value) {
      case Operation.InlineCreate: {
        // Inline creation
        poitems.value.push({
          id: _.uniqueId("newpoitem_"),
          count: result.count,
          partid: result.partid,
          poid: "",
          created: "",
          createdBy: "",
          modified: "",
          modifiedBy: "",
          getPartNamePromise: formatPart(result),
        });
        break;
      }

      case Operation.InlineUpdate: {
        // Inline update
        const index = _.findIndex(poitems.value, (item) => item.id === result.id);
        if (index !== -1) {
          const poitem = poitems.value[index];
          poitem.count = result.count;
          poitem.partid = result.partid;
          poitem.getPartNamePromise = formatPart(result);
        }
        break;
      }

      case Operation.StandaloneCreate:
      case Operation.StandaloneUpdate: {
        await loadPOItems(1, false);
        break;
      }
    }   
  }
};

const addPOItem = () => {
  switch (operation.value) {
    case Operation.StandaloneCreate: {
      // Prepare for inline creation
      poitemOperation.value = Operation.InlineCreate;
      poitemDrawerPOId.value = undefined;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = poitems.value;
      break;
    }
    case Operation.StandaloneUpdate: {
      // Prepare for standalone creation
      poitemOperation.value = Operation.StandaloneCreate;
      poitemDrawerPOId.value = po.value.id;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = undefined;
      break;
    }
  }

  poitemDrawer.value = true;
};

const editPOItem = (current: POItemTableRow) => {
  switch (operation.value) {
    case Operation.StandaloneCreate: {
      // Prepare for inline editing
      poitemOperation.value = Operation.InlineUpdate;
      poitemDrawerPOId.value = undefined;
      poitemDrawerPOItemId.value = undefined;
      poitemDrawerPOItem.value = current;
      poitemDrawerPOItems.value = poitems.value;
      break;
    }
    case Operation.StandaloneUpdate: {
      // Prepare for standalone editing
      poitemOperation.value = Operation.StandaloneUpdate;
      poitemDrawerPOId.value = po.value.id;
      poitemDrawerPOItemId.value = current.id;
      poitemDrawerPOItem.value = undefined;
      poitemDrawerPOItems.value = undefined;
      break;
    }
  }

  poitemDrawer.value = true;
};

const deletePOItems = async (...poitemsToDelete: POItemTableRow[]) => {
  ElMessageBox.confirm(strings.value.views.poitem.confirmDelete, {
    type: "warning",
    confirmButtonText: strings.value.app.common.yes,
    cancelButtonText: strings.value.app.common.no,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  }).then(async () => {
    switch (operation.value) {
      case Operation.StandaloneCreate: {
        // Inline deletion
        poitemsToDelete.forEach((poitem) => {
          _.remove(poitems.value, (item) => item.id === poitem.id);
        });

        break;
      }

      case Operation.StandaloneUpdate: {
        // Standalone deletion
        try {
          saving.value = true;

          await Promise.all(
            _.map(poitemsToDelete, async (poitem) => {
              const partName = await formatPart(poitem);

              const promise = removePOItem(poitem.id);

              publish(plugin, {
                promise: promise,
                failureTitle: strings.value.app.common.deleteErrorTitle,
                failureMessage: format(strings.value.views.poitem.deleteErrorMessage, { partName }),
                successTitle: strings.value.app.common.deleteSuccessTitle,
                successMessage: format(strings.value.views.poitem.deleteSuccessMessage, { partName }),
                inProgressTitle: strings.value.app.common.deleteInProgressTitle,
                inProgressMessage: format(strings.value.views.poitem.deleteInProgressMessage, { partName }),
              });

              await sleep(100); // Slight delay to avoid overwhelming the backend

              return promise;
            })
          );

          await loadPOItems(1, false);
        } finally {
          saving.value = false;
        }

        break;
      }
    }
  }, _.noop);
};

type POItemTableRow = POItem & { getPartNamePromise: Promise<string> };
</script>

<template>
  <view-page :title="operation === Operation.StandaloneUpdate ? strings.app.views.po.update : strings.app.views.po.create" :init="load">
    <el-container>
      <el-main v-loading="loading || saving">
        <el-form ref="formInstance" :model="po" :rules="rules" label-width="auto">
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
            <el-table-column prop="partid" :label="strings.part.fullName">
              <template #default="scope">
                <table-lazy-column :loader="(scope.row as POItemTableRow).getPartNamePromise" />
              </template>
            </el-table-column>
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
        <el-row v-if="operation === Operation.StandaloneUpdate" class="pagination-container">
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
