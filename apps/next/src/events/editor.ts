import { eventBus } from "../lib/event-bus";

export const editorEventChannel = eventBus<{
  refresh: () => void;
  openSearchImages: (contextId?: string) => void;
  requestUploadUrl: (contextId?: string) => void;
  startUpload: (jwt: string) => void;
  uploadComplete: (contextId?: string) => void;
  imageSelected: (args: {
    contextId?: string;
    optimisticUrl: string;
    query?: string;
    index?: number;
  }) => void;
}>();
