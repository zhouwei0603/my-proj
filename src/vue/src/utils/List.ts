import * as _ from "lodash";

export class List<T> {
  protected readonly list: T[] = [];
  protected readonly options: Readonly<Options<T>>;

  public constructor(options: Readonly<Options<T>>) {
    this.options = options;
  }

  public get data(): ReadonlyArray<T> {
    return this.list;
  }

  public push(...items: T[]): number {
    if (items) {
      _.forEach(items, (item) => {
        this.pushCore(item);
      });
    }

    return this.list.length;
  }

  public clear(): T[] {
    return _.slice(this.list);
  }

  public remove(item: T): T | undefined;
  public remove(predicate: (item: T) => boolean): T[];
  public remove(param: T | ((item: T) => boolean)): (T | undefined) | T[] {
    if (_.isFunction(param)) {
      return _.remove(this.list, param);
    } else {
      const deleted = _.remove(this.list, (item) => item === param);
      return deleted?.length ? deleted[0] : undefined;
    }
  }

  public removeAt(index: number): T | undefined {
    const deleted = this.list.splice(index, 1);
    return deleted?.length ? deleted[0] : undefined;
  }

  protected pushCore(item: T): void {
    if (this.list.length < this.options.maxSize) {
      this.list.push(item);
    } else {
      switch (this.options.behavior) {
        case ExceededBehavior.Custom: {
          if (this.options.customPredicate) {
            _.remove(this.list, this.options.customPredicate);

            if (this.list.length < this.options.maxSize) {
              this.list.push(item);
            }
          }

          break;
        }

        case ExceededBehavior.RemoveOldest: {
          let indexToRemove = _.findIndex(
            this.list,
            this.options.customPredicate || (() => true)
          );

          if (indexToRemove < 0) {
            indexToRemove = 0;
          }

          this.list.splice(indexToRemove, 1);

          if (this.list.length < this.options.maxSize) {
            this.list.push(item);
          }

          break;
        }

        case ExceededBehavior.PreventAdding: {
          break;
        }
      }
    }
  }
}

export interface Options<T> {
  maxSize: number;
  behavior: ExceededBehavior;
  customPredicate?: (item: T) => boolean;
}

export const enum ExceededBehavior {
  Custom = "Custom",
  RemoveOldest = "RemoveOldest",
  PreventAdding = "PreventAdding",
}
