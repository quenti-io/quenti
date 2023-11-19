import { eventBus } from "../lib/event-bus";

export const editorEventChannel = eventBus<{
  openSearchImages: (contextId?: string) => void;
  imageSelected: (args: {
    contextId?: string;
    optimisticUrl: string;
    query: string;
    index: number;
  }) => void;
}>();
