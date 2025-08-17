import { type ComputedRef, type Ref } from "vue";
import { type List } from "./List";
import { type Strings, SupportedLanguages } from "./LocaleCore";
import { type Notification } from "./NotificationCore";

export interface AppPlugin {
  strings: ComputedRef<Strings>;
  language: Ref<SupportedLanguages, SupportedLanguages>;
  notifications: Ref<List<Notification>, List<Notification>>;
}
