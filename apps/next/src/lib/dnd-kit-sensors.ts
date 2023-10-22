import { PointerSensor } from "@dnd-kit/core";

export class InteractivePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
        return !(
          !event.isPrimary ||
          event.button !== 0 ||
          (event.target instanceof HTMLElement &&
            isInteractiveElement(event.target))
        );
      },
    },
  ];
}

const isInteractiveElement = (element: HTMLElement) => {
  const interactiveElements = [
    "button",
    "input",
    "textarea",
    "select",
    "option",
  ];

  return interactiveElements.includes(element.tagName.toLowerCase());
};
