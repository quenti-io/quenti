import { eventBus } from "../lib/event-bus";

export type Context = {
  termId: string;
  studySetId: string;
};

export const editorEventChannel = eventBus<{
  refresh: () => void;
  openSearchImages: (context: Context) => void;
  requestUploadUrl: (context: Context) => void;
  startUpload: (jwt: string) => void;
  uploadComplete: (context: Context) => void;
  propagateImageUrl: (args: { id: string; url: string }) => void;
  imageSelected: (args: {
    context: Context;
    optimisticUrl: string;
    query?: string;
    index?: number;
  }) => void;
}>();
