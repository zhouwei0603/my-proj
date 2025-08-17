import { type Ref } from "vue";

export const enum NotificationState {
  Failed = "Failed",
  Succeeded = "Succeeded",
  InProgress = "InProgress",
}

export interface Options {
  promise: Promise<any>;
  failureTitle: string;
  failureMessage: string;
  successTitle: string;
  successMessage: string;
  inProgressTitle: string;
  inProgressMessage: string;
}

export interface Notification {
  id: string;
  publishTime: Ref<Date | undefined, Date | undefined>;
  state: Ref<NotificationState, NotificationState>;
  title: Ref<string, string>;
  message: Ref<string, string>;
  publish(): void;
  remove(): void;
}
