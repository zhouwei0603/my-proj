import { type App, computed, type Plugin, reactive, ref } from "vue";
import { getCurrentUser } from "../stores/user";
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
      user: ref({ name: "" }),
      strings: computed(() =>
        language.value === SupportedLanguages.zhCn ? zhCn : en
      ),
      language: language,
      notifications: reactive<List<Notification>>(
        new ListImpl<Notification>({
          maxSize: 100,
          behavior: ExceededBehavior.RemoveOldest,
          reversed: true,
          customPredicate: (n) => n.state.value === NotificationState.Succeeded,
        })
      ),
    };

    getCurrentUser().then((user) => {
      proj.user.value = user;
    });

    app.config.globalProperties.$proj = proj;
  },
};
