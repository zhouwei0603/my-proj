import * as _ from "lodash";
import { computed, ref, type Ref } from "vue";
import { List } from "./List";

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

export type NotificationType = Ref<List<Notification>, List<Notification>>;

export function removeAll(source: NotificationType): void {
  source.value.clear();
}

export function publish(
  source: NotificationType,
  options: Readonly<Options>
): Notification {
  const n = new Notification(source, options);
  n.publish();
  return n;
}

export class Notification {
  private readonly _source: NotificationType;
  private readonly _options: Readonly<Options>;
  private readonly _publishTime = ref<Date>();
  private readonly _state = ref<NotificationState>();
  private readonly _title = ref<string>();
  private readonly _message = ref<string>();

  public readonly publishTime = computed(() => this._publishTime.value);
  public readonly state = computed(() => this._state.value || NotificationState.InProgress);
  public readonly title = computed(() => this._title.value || ``);
  public readonly message = computed(() => this._message.value || ``);

  public constructor(source: NotificationType, options: Readonly<Options>) {
    this._source = source;
    this._options = options;

    this._state.value = NotificationState.InProgress;
    this._title.value = options.inProgressTitle;
    this._message.value = options.inProgressMessage;

    options.promise.then(
      () => {
        this._state.value = NotificationState.Succeeded;
        this._title.value = options.successTitle;
        this._message.value = options.successMessage;
      },
      (error) => {
        this._state.value = NotificationState.Failed;
        this._title.value = options.failureTitle;
        this._message.value = this._formatErrorMessage(error);
      }
    );
  }

  public publish(): void {
    this._publishTime.value = new Date();

    this._source.value.push(this);
  }

  public remove(): void {
    this._source.value.remove(this);
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

export const key = Symbol();
