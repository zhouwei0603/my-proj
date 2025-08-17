import { getCurrentInstance } from "vue";
import { type AppPlugin } from "./AppContext";

export function getAppPlugin(): AppPlugin {
  const instance = getCurrentInstance();
  return instance?.appContext.app.config.globalProperties.$proj;
}
