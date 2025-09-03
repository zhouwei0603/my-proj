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
      emptyDescription: "No notification",
    },
    common: {
      loading: "Loading",
      noData: "No data",
      error: "Error",
      yes: "Yes",
      no: "No",
      ok: "OK",
    },
    commands: {
      save: "Save",
      close: "Close",
      cancel: "Cancel",
    },
    timeSpan: {
      second: "Less than 1 minute",
      minute: "{value} minute(s) ago",
      hour: "{value} hour(s) ago",
      day: "{value} day(s) ago",
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
    },
  },
  part: {
    name: "Name",
  },
  po: {
    title: "Title",
  },
  views: {
    created: "Created",
    modified: "Modified",
    createdBy: "Created by",
    modifiedBy: "Modified by",
    refresh: "Refresh",
    deleteErrorTitle: "Delete Error",
    deleteSuccessTitle: "Delete Successful",
    deleteInProgressTitle: "Please wait",
    updateErrorTitle: "Update Error",
    updateSuccessTitle: "Update Successful",
    updateInProgressTitle: "Please wait",
    createErrorTitle: "Create Error",
    createSuccessTitle: "Create Successful",
    createInProgressTitle: "Please wait",
    part: {
      searchByName: "Search by name",
    },
    po: {
      searchByTitle: "Search by title",
      create: "Create new PO",
      update: "Edit selected PO",
      delete: "Delete selected PO",
      confirmDelete: "Are you sure to delete the selected PO(s)? This action cannot be undone.",
      deleteErrorMessage: "Failed to delete the PO {name}. They may have related PO items.\n{msg}",
      deleteSuccessMessage: "The selected PO {name} have been deleted successfully.",
      deleteInProgressMessage: "Deleting PO {name}...",
      updateErrorMessage: "Failed to update the PO {name}.\n{msg}",
      updateSuccessMessage: "The PO {name} has been updated successfully.",
      updateInProgressMessage: "Updating PO {name}...",
      createErrorMessage: "Failed to create the PO {name}.\n{msg}",
      createSuccessMessage: "The PO {name} has been created successfully.",
      createInProgressMessage: "Creating PO {name}...",
    },
  },
} as const;
