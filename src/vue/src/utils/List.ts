import * as _ from "lodash";

export interface List<T> {
  data: ReadonlyArray<T>;
  push(...items: T[]): number;
  clear(): T[];
  remove(item: T): T | undefined;
  remove(predicate: (item: T) => boolean): T[];
  removeAt(index: number): T | undefined;
}

export class ListImpl<T> implements List<T> {
  private readonly _list: T[] = [];
  private readonly _options: Readonly<Options<T>>;

  public constructor(options: Readonly<Options<T>>) {
    this._options = options;
  }

  public get data(): ReadonlyArray<T> {
    return this._list;
  }

  public push(...items: T[]): number {
    if (items) {
      _.forEach(items, (item) => {
        this._pushCore(item);
      });
    }

    return this._list.length;
  }

  public clear(): T[] {
    return _.slice(this._list);
  }

  public remove(item: T): T | undefined;
  public remove(predicate: (item: T) => boolean): T[];
  public remove(param: T | ((item: T) => boolean)): (T | undefined) | T[] {
    if (_.isFunction(param)) {
      return _.remove(this._list, param);
    } else {
      const deleted = _.remove(this._list, (item) => item === param);
      return deleted?.length ? deleted[0] : undefined;
    }
  }

  public removeAt(index: number): T | undefined {
    const deleted = this._list.splice(index, 1);
    return deleted?.length ? deleted[0] : undefined;
  }

  private _pushCore(item: T): void {
    if (this._list.length < this._options.maxSize) {
      this._list.push(item);
    } else {
      switch (this._options.behavior) {
        case ExceededBehavior.Custom: {
          if (this._options.customPredicate) {
            _.remove(this._list, this._options.customPredicate);

            if (this._list.length < this._options.maxSize) {
              this._list.push(item);
            }
          }

          break;
        }

        case ExceededBehavior.RemoveOldest: {
          let indexToRemove = _.findIndex(
            this._list,
            this._options.customPredicate || (() => true)
          );

          if (indexToRemove < 0) {
            indexToRemove = 0;
          }

          this._list.splice(indexToRemove, 1);

          if (this._list.length < this._options.maxSize) {
            this._list.push(item);
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
