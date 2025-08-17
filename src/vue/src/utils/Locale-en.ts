import { type Strings } from "./LocaleCore";

export const strings: Strings = {
  app: {
    header: {
      notification: "Notification",
      settings: "Settings",
    },
    navigator: {
      overview: "Overview",
      management: "Management",
      po: "PO",
      part: "Parts",
      help: "Help",
      document: "Documents",
      about: "About",
    },
    settings: {
      title: "Configuration",
      language: "Language",
    },
    notification: {
      title: "Notification",
      remove: "Dismiss",
      removeAllButton: "Dismiss all",
      emptyDescription: "No notification"
    },
    commands: {
      save: "Save",
      close: "Close",
      cancel: "Cancel",
    },
    timeSpan: {
      second: "Less than 1 minute",
      minute: "${value} minute(s) ago",
      hour: "${value} hour(s) ago",
      day: "${value} day(s) ago"
    },
    views: {
      part: {
        create: "Add new part",
        update: "Update part",
      },
      poitem: {
        create: "Add new PO item",
        update: "Update PO item",
      },
      po: {
        create: "Add new PO",
        update: "Update PO",
      },
    }
  },
} as const;
