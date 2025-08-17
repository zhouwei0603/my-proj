import { type App, computed, type Plugin, ref } from "vue";
import { defaultLanguage, type LanguageType, languageKey, type LanguageStringsType, languageStringsKey, SupportedLanguages } from "./Locale";
import { strings as en } from "./Locale-en";
import { strings as zhCn } from "./Locale-zhCn";
import { type Strings } from "./LocaleCore";

const language: LanguageType = ref<SupportedLanguages>(defaultLanguage);
const languageStrings: LanguageStringsType = computed<Strings>(() =>
  language.value === SupportedLanguages.zhCn ? zhCn : en
);

export const localePlugin: Plugin = {
  install(app: App) {
    language.value = SupportedLanguages.en;

    app.provide(languageKey, language);
    app.provide(languageStringsKey, languageStrings);
  },
};
