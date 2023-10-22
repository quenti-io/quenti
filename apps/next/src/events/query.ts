import { eventBus } from "../lib/event-bus";
import type { FolderData } from "../modules/hydrate-folder-data";
import type { SetData } from "../modules/hydrate-set-data";

export const queryEventChannel = eventBus<{
  setQueryRefetched: (data: SetData) => void;
  folderQueryRefetched: (data: FolderData) => void;
}>();
