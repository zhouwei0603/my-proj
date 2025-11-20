<script setup lang="ts">
import { type FormInstance, type FormRules, ElButton, ElDrawer, ElForm, ElFormItem } from "element-plus";
import _ from "lodash";
import { reactive, ref, watch } from "vue";
import { get as getPart } from "../stores/part";
import { type POItem, create as createPOItem, get as getPOItem, update as updatePOItem } from "../stores/poitem";
import { getAppPlugin } from "../utils/AppUtils";
import { Operation } from "../utils/Common";
import { publish } from "../utils/Notification";
import { format } from "../utils/String";
import * as Validation from "../utils/Validation";

const props = withDefaults(
  defineProps<{
    operation: Operation;
    // For InlineCreate and InlineUpdate
    poitems?: readonly POItem[];
    // For InlineUpdate
    poitem?: POItemViewModel;
    // For StandaloneCreate and StandaloneUpdate
    poid?: string;
    // For StandaloneUpdate
    poitemid?: string;
  }>(),
  {
    poitems: () => [],
    poitem: () => ({ id: _.uniqueId("newpoitem_"), count: Validation.POItemMinCount, partid: "" }),
    poid: "",
    poitemid: "",
  }
);
const drawer = defineModel<boolean>({
  default: false,
  required: true,
});
const emits = defineEmits<{
  closed: [POItemViewModel];
}>();

const plugin = getAppPlugin();
const strings = plugin.strings;
const saving = ref<boolean>(false);
const loading = ref<boolean>(false);
const formInstance = ref<FormInstance>();
const rules = ref<FormRules>();
const poitem = reactive<POItemViewModel>({
  id: props.poitem?.id || props.poitemid,
  count: props.poitem.count,
  partid: props.poitem.partid,
});

const load = async () => {
  if (props.operation === Operation.StandaloneUpdate) {
    try {
      loading.value = true;

      const response = await getPOItem(props.poitemid);
      poitem.id = response.id;
      poitem.partid = response.partid;
      poitem.count = response.count;
    } finally {
      loading.value = false;
    }
  }
};

const save = async () => {
  try {
    saving.value = true;

    const valid = await formInstance.value!.validate();
    if (!valid) {
      return;
    }

    if (props.operation === Operation.StandaloneCreate || props.operation === Operation.StandaloneUpdate) {
      const part = await getPart(poitem.partid);
      let promise: Promise<POItem>;
      let options: Parameters<typeof publish>[1];

      switch (props.operation) {
        case Operation.StandaloneCreate: {
          promise = createPOItem({
            count: poitem.count,
            poid: props.poid,
            partid: poitem.partid,
          });
          options = {
            promise,
            failureTitle: strings.value.app.common.createErrorTitle,
            failureMessage: format(strings.value.views.poitem.createErrorMessage, { partName: part.name }),
            successTitle: strings.value.app.common.createSuccessTitle,
            successMessage: format(strings.value.views.poitem.createSuccessMessage, { partName: part.name }),
            inProgressTitle: strings.value.app.common.createInProgressTitle,
            inProgressMessage: format(strings.value.views.poitem.createInProgressMessage, { partName: part.name }),
          };
          break;
        }
        case Operation.StandaloneUpdate: {
          promise = updatePOItem(props.poitemid, {
            count: poitem.count,
            poid: props.poid,
            partid: poitem.partid,
          });
          options = {
            promise,
            failureTitle: strings.value.app.common.updateErrorTitle,
            failureMessage: format(strings.value.views.poitem.updateErrorMessage, { partName: part.name }),
            successTitle: strings.value.app.common.updateSuccessTitle,
            successMessage: format(strings.value.views.poitem.updateSuccessMessage, { partName: part.name }),
            inProgressTitle: strings.value.app.common.updateInProgressTitle,
            inProgressMessage: format(strings.value.views.poitem.updateInProgressMessage, { partName: part.name }),
          };
          break;
        }
      }

      publish(plugin, options);

      await promise;
    }

    close();
    emits("closed", {
      id: poitem.id,
      partid: poitem.partid,
      count: poitem.count,
    });
  } finally {
    saving.value = false;
  }
};

const close = () => {
  drawer.value = false;
};

const clear = () => {
  poitem.count = Validation.POItemMinCount;
  poitem.partid = "";
  formInstance.value?.clearValidate();
};

const getRules = () => {
  switch (props.operation) {
    case Operation.InlineCreate:
    case Operation.InlineUpdate: {
      return Validation.getPOItemRules(plugin, {
        operation: props.operation,
        poitems: props.poitems,
        poitemToValidate: poitem,
      });
    }
    case Operation.StandaloneCreate:
    case Operation.StandaloneUpdate: {
      return Validation.getPOItemRules(plugin, {
        operation: props.operation,
        poitemToValidate: poitem,
        poid: props.poid,
      });
    }
  }
};

watch(
  [poitem],
  () => {
    rules.value = getRules();
  },
  { deep: true, immediate: true }
);

export type POItemViewModel = Omit<POItem, "poid" | "created" | "createdBy" | "modified" | "modifiedBy">;
</script>

<template>
  <el-drawer v-model="drawer" @open="load" @closed="clear" size="50%" :title="props.operation === Operation.InlineUpdate || props.operation === Operation.StandaloneUpdate ? strings.views.poitem.update : strings.views.poitem.create" :destroy-on-close="true" :close-on-click-modal="false">
    <template #default>
      <el-form ref="formInstance" :model="poitem" :rules="rules" v-loading="saving || loading" label-width="auto">
        <el-form-item :label="strings.poitem.part" prop="partid">
          <part-select v-model="poitem.partid" />
        </el-form-item>
        <el-form-item :label="strings.poitem.count" prop="count">
          <el-input-number v-model="poitem.count" :min="Validation.POItemMinCount" :step="1" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save" v-if="props.operation === Operation.InlineCreate || props.operation === Operation.StandaloneCreate" :loading="saving" :disabled="loading">{{ saving ? strings.app.common.adding : strings.app.commands.add }}</el-button>
      <el-button type="primary" @click="save" v-if="props.operation === Operation.InlineUpdate || props.operation === Operation.StandaloneUpdate" :loading="saving" :disabled="loading">{{ saving ? strings.app.common.updating : strings.app.commands.update }}</el-button>
      <el-button @click="close">{{ strings.app.commands.cancel }}</el-button>
    </template>
  </el-drawer>
</template>
