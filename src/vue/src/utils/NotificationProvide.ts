import { type App, type Plugin, ref } from "vue";
import { ExceededBehavior, List } from "./List";
import { key, Notification, NotificationState } from "./Notification";

const all = ref<List<Notification>>(
  new List<Notification>({
    maxSize: 100,
    behavior: ExceededBehavior.RemoveOldest,
    customPredicate: (n) => n.state.value === NotificationState.Succeeded,
  })
);

export const notificationPlugin: Plugin = {
  install(app: App) {
    app.provide(key, all);
  },
};
