import { ElNotification, notificationTypes } from "element-plus";
import * as _ from "lodash";
import { ref } from "vue";
import { type AppPlugin } from "./AppContext";
import {
  type Notification,
  NotificationState,
  type Options,
} from "./NotificationCore";
import { format } from "./String";

export function removeAll(plugin: AppPlugin): void {
  plugin.notifications.clear();
}

export function publish(
  plugin: AppPlugin,
  options: Readonly<Options>
): Notification {
  const n = new NotificationImpl(plugin.notifications, options);
  n.publish();
  return n;
}

class NotificationImpl implements Notification {
  private readonly _notifications: AppPlugin["notifications"];
  private readonly _options: Readonly<Options>;
  public readonly id = _.uniqueId("proj-notification-");
  public readonly publishTime = ref<Date | undefined>();
  public readonly state = ref<NotificationState>(NotificationState.InProgress);
  public readonly title = ref<string>("");
  public readonly message = ref<string>("");

  public constructor(
    notifications: AppPlugin["notifications"],
    options: Readonly<Options>
  ) {
    this._notifications = notifications;
    this._options = options;

    this.state.value = NotificationState.InProgress;
    this.title.value = options.inProgressTitle;
    this.message.value = options.inProgressMessage;

    options.promise.then(
      () => {
        this.state.value = NotificationState.Succeeded;
        this.title.value = options.successTitle;
        this.message.value = options.successMessage;

        this._showPopup("success");
      },
      (error) => {
        this.state.value = NotificationState.Failed;
        this.title.value = options.failureTitle;
        this.message.value = this._formatErrorMessage(error);

        this._showPopup("error");
      }
    );
  }

  public publish(): void {
    this.publishTime.value = new Date();

    this._notifications.add(this);

    this._showPopup("info");
  }

  public remove(): void {
    this._notifications.remove(this);
  }

  private _formatErrorMessage(error: any): string {
    if (_.isNil(error)) {
      return this._options.failureMessage;
    }

    if (_.isString(error)) {
      return format(this._options.failureMessage, { msg: error });
    }

    if (error.message) {
      return format(this._options.failureMessage, { msg: error.message });
    }

    if (_.isFunction(error.toString)) {
      return format(this._options.failureMessage, { msg: error.toString() });
    }

    return format(this._options.failureMessage, { msg: error });
  }

  private _showPopup(
    type: ElNotificationType[1] | ElNotificationType[2] | ElNotificationType[4]
  ): void {
    ElNotification({
      title: this.title.value,
      message: this.message.value,
      type: type,
    });
  }
}

type ElNotificationType = typeof notificationTypes;
