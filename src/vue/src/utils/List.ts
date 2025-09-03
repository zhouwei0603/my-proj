import _ from "lodash";

export interface List<T> {
  data: ReadonlyArray<T>;
  add(...items: T[]): number;
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

  public add(...items: T[]): number {
    if (items) {
      _.forEach(items, (item) => {
        this._addCore(item);
      });
    }

    return this._list.length;
  }

  public clear(): T[] {
    return this._list.splice(0);
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

  private _addCore(item: T): void {
    if (this._list.length < this._options.maxSize) {
      this._insertOrAppend(item);
    } else {
      switch (this._options.behavior) {
        case ExceededBehavior.Custom: {
          if (this._options.customPredicate) {
            _.remove(this._list, this._options.customPredicate);

            if (this._list.length < this._options.maxSize) {
              this._insertOrAppend(item);
            }
          }

          break;
        }

        case ExceededBehavior.RemoveOldest: {
          let indexToRemove = -1;

          if (this._options.reversed) {
            indexToRemove = _.findLastIndex(
              this._list,
              this._options.customPredicate || (() => true)
            );
          } else {
            indexToRemove = _.findIndex(
              this._list,
              this._options.customPredicate || (() => true)
            );
          }

          if (indexToRemove < 0) {
            if (this._options.reversed) {
              indexToRemove = this._list.length - 1;
            } else {
              indexToRemove = 0;
            }
          }

          this._list.splice(indexToRemove, 1);

          if (this._list.length < this._options.maxSize) {
            this._insertOrAppend(item);
          }

          break;
        }

        case ExceededBehavior.PreventAdding: {
          break;
        }
      }
    }
  }

  private _insertOrAppend(item: T): void {
    if (this._options.reversed) {
      this._list.splice(0, 0, item);
    } else {
      this._list.push(item);
    }
  }
}

export interface Options<T> {
  maxSize: number;
  behavior: ExceededBehavior;
  reversed?: boolean;
  customPredicate?: (item: T) => boolean;
}

export const enum ExceededBehavior {
  Custom = "Custom",
  RemoveOldest = "RemoveOldest",
  PreventAdding = "PreventAdding",
}
