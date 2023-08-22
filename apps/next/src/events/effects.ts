import { eventBus } from "../lib/event-bus";

export const effectChannel = eventBus<{
  prepareConfetti: () => void;
  confetti: () => void;
}>();
