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
  publishTime: Date | undefined;
  state: NotificationState;
  title: string;
  message: string;
  publish(): void;
  remove(): void;
}
