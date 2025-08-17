import * as _ from "lodash";
import { type LanguageStringsType } from "./Locale";

export function toDisplayString(strings: LanguageStringsType, ms: number): string {
  if (ms >= day) {
    const compiled = _.template(strings.value.app.timeSpan.day);
    const value = ms / day;
    return compiled({ value });
  }

  if (ms >= hour) {
    const compiled = _.template(strings.value.app.timeSpan.hour);
    const value = ms / hour;
    return compiled({ value });
  }

  if (ms >= minute) {
    const compiled = _.template(strings.value.app.timeSpan.minute);
    const value = ms / minute;
    return compiled({ value });
  }

  return strings.value.app.timeSpan.second;
}

const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const minute = 60 * 1000;
