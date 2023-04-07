import { eventBus } from "../lib/event-bus";
import type { SetData } from "../modules/hydrate-set-data";

export const queryEventChannel = eventBus<{
  setQueryRefetched: (data: SetData) => void;
}>();
