import * as _ from "lodash";
import { type AppPlugin } from "./AppContext";
import {
  type Notification,
  NotificationState,
  type Options,
} from "./NotificationCore";

export function removeAll(plugin: AppPlugin): void {
  plugin.notifications.value.clear();
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
  private _publishTime: Date | undefined;
  private _state: NotificationState;
  private _title: string;
  private _message: string;

  public constructor(
    notifications: AppPlugin["notifications"],
    options: Readonly<Options>
  ) {
    this._notifications = notifications;
    this._options = options;

    this._state = NotificationState.InProgress;
    this._title = options.inProgressTitle;
    this._message = options.inProgressMessage;

    options.promise.then(
      () => {
        this._state = NotificationState.Succeeded;
        this._title = options.successTitle;
        this._message = options.successMessage;
      },
      (error) => {
        this._state = NotificationState.Failed;
        this._title = options.failureTitle;
        this._message = this._formatErrorMessage(error);
      }
    );
  }

  public get publishTime(): Date | undefined {
    return this._publishTime;
  }

  public get state(): NotificationState {
    return this._state;
  }

  public get title(): string {
    return this._title;
  }

  public get message(): string {
    return this._message;
  }

  public publish(): void {
    this._publishTime = new Date();

    this._notifications.value.push(this);
  }

  public remove(): void {
    this._notifications.value.remove(this);
  }

  private _formatErrorMessage(error: any): string {
    if (_.isNil(error)) {
      return this._options.failureMessage;
    }

    const compiled = _.template(this._options.failureMessage);

    if (_.isString(error)) {
      return compiled({ msg: error });
    }

    if (error.message) {
      return compiled({ msg: error.message });
    }

    if (_.isFunction(error.toString)) {
      return compiled({ msg: error.toString() });
    }

    return compiled({ msg: error });
  }
}
