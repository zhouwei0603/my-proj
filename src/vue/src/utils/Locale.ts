import { computed, inject, ref, type ComputedRef, type Ref } from "vue";
import { strings as en } from "./Locale-en";
import { type Strings } from "./LocaleCore";

export type LanguageType = Ref<SupportedLanguages, SupportedLanguages>;
export type LanguageStringsType = ComputedRef<Strings>;

export const enum SupportedLanguages {
  en = "en",
  zhCn = "zh-cn",
}

export function getStrings(): LanguageStringsType {
  return inject<LanguageStringsType>(languageStringsKey, computed(() => defaultLanguageStringd));
}

export function getLanguage(): LanguageType {
  return inject<LanguageType>(languageKey, ref(defaultLanguage));
}

export const defaultLanguage = SupportedLanguages.en;
export const defaultLanguageStringd = en;

export const languageKey = Symbol();
export const languageStringsKey = Symbol();
