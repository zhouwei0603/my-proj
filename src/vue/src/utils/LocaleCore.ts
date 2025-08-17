import type { DeepReadonly } from "vue";

export type Strings = DeepReadonly<{
  app: {
    header: {
      notification: string,
      settings: string,
    },
    navigator: {
      overview: string,
      management: string,
      po: string,
      part: string,
      help: string,
      document: string,
      about: string,
    },
    settings: {
      title: string,
      language: string,
    },
    notification: {
      title: string,
      remove: string,
      removeAllButton: string,
      emptyDescription: string,
    },
    commands: {
      save: string,
      close: string,
      cancel: string,
    },
    timeSpan: {
      second: string,
      minute: string,
      hour: string,
      day: string
    }
  },
}>;
