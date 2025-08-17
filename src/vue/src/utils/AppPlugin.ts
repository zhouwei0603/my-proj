import { type App, computed, type Plugin, ref } from "vue";
import { type AppPlugin } from "./AppContext";
import { ExceededBehavior, type List, ListImpl } from "./List";
import { strings as en } from "./Locale-en";
import { strings as zhCn } from "./Locale-zhCn";
import { SupportedLanguages } from "./LocaleCore";
import { type Notification, NotificationState } from "./NotificationCore";

export const appPlugin: Plugin = {
  install(app: App) {
    const language = ref(SupportedLanguages.en);

    const proj: AppPlugin = {
      strings: computed(() =>
        language.value === SupportedLanguages.zhCn ? zhCn : en
      ),
      language: language,
      notifications: ref<List<Notification>>(
        new ListImpl<Notification>({
          maxSize: 100,
          behavior: ExceededBehavior.RemoveOldest,
          customPredicate: (n) => n.state === NotificationState.Succeeded,
        })
      ),
    };

    app.config.globalProperties.$proj = proj;
  },
};
