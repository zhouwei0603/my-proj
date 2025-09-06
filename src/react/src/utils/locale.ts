import { DeepReadonly } from "next/dist/shared/lib/deep-readonly";

export type Strings = DeepReadonly<{
  commands: {
    refresh: string;
    cancel: string;
    close: string;
    save: string;
    yes: string;
    no: string;
  };
  pages: {
    userList: {
      title: string;
      create: string;
      update: string;
      delete: string;
    };
  };
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}>;

export const enum SupportedLanguages {
  en = "en",
  zhCn = "zh-cn",
}
