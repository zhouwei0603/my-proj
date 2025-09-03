import _ from "lodash";
import { type AppPlugin } from "./AppContext";

export function toDisplayString(plugin: AppPlugin, ms: number): string {
  const strings = plugin.strings;

  if (ms >= day) {
    const compiled = _.template(strings.value.app.timeSpan.day);
    const value = _.toInteger(ms / day);
    return compiled({ value });
  }

  if (ms >= hour) {
    const compiled = _.template(strings.value.app.timeSpan.hour);
    const value = _.toInteger(ms / hour);
    return compiled({ value });
  }

  if (ms >= minute) {
    const compiled = _.template(strings.value.app.timeSpan.minute);
    const value = _.toInteger(ms / minute);
    return compiled({ value });
  }

  return strings.value.app.timeSpan.second;
}

const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const minute = 60 * 1000;
