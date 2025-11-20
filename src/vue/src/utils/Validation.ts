import { type FormRules } from "element-plus";
import _ from "lodash";
import * as Part from "../stores/part";
import * as PO from "../stores/po";
import * as POItem from "../stores/poitem";
import { Operation } from "../utils/Common";
import { format } from "../utils/String";
import * as Validation from "../utils/Validation";
import { type AppPlugin } from "./AppContext";

export const POTitleMaxLength = 100;

export function getPORules(plugin: AppPlugin, options: Readonly<{ operation: Operation.StandaloneCreate | Operation.StandaloneUpdate }>): FormRules<PO.PO> {
  return {
    title: [
      { required: true, message: plugin.strings.value.app.validation.required, trigger: "blur" },
      { max: Validation.POTitleMaxLength, message: format(plugin.strings.value.app.validation.maxLength, { max: Validation.POTitleMaxLength }), type: "string", trigger: "blur" },
      {
        asyncValidator: async (rule, value: string, callback) => {
          if (options.operation === Operation.StandaloneCreate && value) {
            const response = await PO.list({
              title: value,
              start: 0,
              size: 1,
            });
            if (response.total > 0) {
              callback(new Error(format(plugin.strings.value.po.validation.duplicate, { title: value })));
              return Promise.reject();
            }
          }
        },
      },
    ],
  };
}

type GetPOItemRulesOptions =
  | {
      operation: Operation.StandaloneCreate | Operation.StandaloneUpdate;
      poitemToValidate: Pick<POItem.POItem, "id">;
      poid: string;
    }
  | {
      operation: Operation.InlineCreate | Operation.InlineUpdate;
      poitemToValidate: Pick<POItem.POItem, "id">;
      poitems: readonly POItem.POItem[];
    };
export const POItemMinCount = 1;

export function getPOItemRules(plugin: AppPlugin, options: Readonly<GetPOItemRulesOptions>): FormRules<POItem.POItem> {
  return {
    count: [
      { required: true, message: plugin.strings.value.app.validation.required, trigger: "blur" },
      { type: "number", min: POItemMinCount, message: format(plugin.strings.value.app.validation.minValue, { min: POItemMinCount }), trigger: "blur" },
    ],
    partid: [
      { required: true, message: plugin.strings.value.app.validation.required, trigger: "blur" },
      {
        asyncValidator: async (rule, value: string, callback) => {
          if (value) {
            let all: readonly POItem.POItem[] = [];
            switch (options.operation) {
              case Operation.StandaloneCreate:
              case Operation.StandaloneUpdate: {
                const response = await POItem.list(options.poid);
                all = response.value;
                break;
              }
              case Operation.InlineCreate:
              case Operation.InlineUpdate: {
                all = options.poitems;
                break;
              }
            }

            const others = _.filter(all, (item) => item.id !== options.poitemToValidate.id);

            const exists = _.find(others, (item) => item.partid === value);
            if (exists) {
              const part = await Part.get(value);
              callback(new Error(format(plugin.strings.value.poitem.validation.duplicatePart, { partName: part.name })));
              return Promise.reject();
            }
          }
        },
      },
    ],
  };
}
