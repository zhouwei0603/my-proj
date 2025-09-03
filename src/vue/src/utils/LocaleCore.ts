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
    },
    commands: {
      save: string;
      close: string;
      cancel: string;
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
  };
  po: {
    title: string;
  };
  views: {
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    refresh: string;
    deleteErrorTitle: string;
    deleteSuccessTitle: string;
    deleteInProgressTitle: string;
    updateErrorTitle: string;
    updateSuccessTitle: string;
    updateInProgressTitle: string;
    createErrorTitle: string;
    createSuccessTitle: string;
    createInProgressTitle: string;
    part: {
      searchByName: string;
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
    };
  };
}>;

export const enum SupportedLanguages {
  en = "en",
  zhCn = "zh-cn",
}
