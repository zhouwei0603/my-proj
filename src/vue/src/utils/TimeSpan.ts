import _ from "lodash";
import { type AppPlugin } from "./AppContext";
import { format } from "./String";

export function toDisplayString(plugin: AppPlugin, ms: number): string {
  const strings = plugin.strings;

  if (ms >= day) {
    const value = _.toInteger(ms / day);
    return format(strings.value.app.timeSpan.day, { value });
  }

  if (ms >= hour) {
    const value = _.toInteger(ms / hour);
    return format(strings.value.app.timeSpan.hour, { value });
  }

  if (ms >= minute) {
    const value = _.toInteger(ms / minute);
    return format(strings.value.app.timeSpan.minute, { value });
  }

  return strings.value.app.timeSpan.second;
}

const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const minute = 60 * 1000;
