import { eventBus } from "../lib/event-bus";

export const menuEventChannel = eventBus<{
  createFolder: (setId?: string) => void;
  openImportDialog: (edit?: boolean) => void;
  folderWithSetCreated: (setId: string) => void;
  openChangelog: () => void;
  openCreateClassNotice: () => void;
  createClass: () => void;
  openSignup: (args: { message?: string; callbackUrl?: string }) => void;
  commandMenuClosed: () => void;
}>();
