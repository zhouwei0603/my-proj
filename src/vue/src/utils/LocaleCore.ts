import type { DeepReadonly } from "vue";

export type Strings = DeepReadonly<{
  app: {
    header: {
      notification: string;
      settings: string;
    };
    navigator: {
      overview: string;
      management: string;
      po: string;
      part: string;
      help: string;
      document: string;
      about: string;
    };
    settings: {
      title: string;
      language: string;
    };
    notification: {
      title: string;
      remove: string;
      removeAllButton: string;
      emptyDescription: string;
    };
    common: {
      loading: string;
      noData: string;
      error: string;
      yes: string;
      no: string;
      ok: string;
      operation: string;
      created: string;
      modified: string;
      createdBy: string;
      modifiedBy: string;
      deleteErrorTitle: string;
      deleteSuccessTitle: string;
      deleteInProgressTitle: string;
      updateErrorTitle: string;
      updateSuccessTitle: string;
      updateInProgressTitle: string;
      createErrorTitle: string;
      createSuccessTitle: string;
      createInProgressTitle: string;
      saving: string;
      executing: string;
      adding: string;
      updating: string;
      deleting: string;
      fetching: string;
    };
    commands: {
      add: string;
      edit: string;
      save: string;
      close: string;
      cancel: string;
      create: string;
      update: string;
      delete: string;
      refresh: string;
    };
    validation: {
      required: string;
      maxLength: string;
      minLength: string;
      rangeLength: string;
      maxValue: string;
      minValue: string;
      rangeValue: string;
    };
    timeSpan: {
      second: string;
      minute: string;
      hour: string;
      day: string;
    };
    views: {
      part: {
        create: string;
        update: string;
      };
      poitem: {
        create: string;
        update: string;
      };
      po: {
        create: string;
        update: string;
      };
    };
  };
  part: {
    name: string;
    fullName: string;
  };
  po: {
    title: string;
    validation: {
      duplicate: string;
    };
  };
  poitem: {
    part: string;
    count: string;
    validation: {
      duplicatePart: string;
    };
  };
  views: {
    part: {
      searchByName: string;
      selectFilterPlaceholder: string;
      selectNoDataText: string;
    };
    po: {
      searchByTitle: string;
      create: string;
      update: string;
      delete: string;
      confirmDelete: string;
      deleteErrorMessage: string;
      deleteSuccessMessage: string;
      deleteInProgressMessage: string;
      updateErrorMessage: string;
      updateSuccessMessage: string;
      updateInProgressMessage: string;
      createErrorMessage: string;
      createSuccessMessage: string;
      createInProgressMessage: string;
      poItems: string;
    };
    poitem: {
      searchByPartName: string;
      create: string;
      update: string;
      delete: string;
      confirmDelete: string;
      deleteErrorMessage: string;
      deleteSuccessMessage: string;
      deleteInProgressMessage: string;
      updateErrorMessage: string;
      updateSuccessMessage: string;
      updateInProgressMessage: string;
      createErrorMessage: string;
      createSuccessMessage: string;
      createInProgressMessage: string;
      part: string;
      count: string;
    };
  };
}>;

export const enum SupportedLanguages {
  en = "en",
  zhCn = "zh-cn",
}
